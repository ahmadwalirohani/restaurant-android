<template>
  <q-page>
    <div class="row q-col-gutter-x-md q-col-gutter-y-md">
      <div class="col-12">
        <q-scroll-area style="width: 100%; height: 50px">
          <q-btn-toggle
            v-model="ReportModel.mainr_item_filter"
            style="width: max-content; margin-top: 5px"
            toggle-color="secondary"
            color="grey-8"
            :options="MainRItems"
            @update:model-value="ReportModel.r_item_filter = '*'"
          ></q-btn-toggle>
        </q-scroll-area>
      </div>
      <div class="col-12">
        <q-scroll-area style="width: 100%; height: 50px">
          <q-btn-toggle
            v-model="ReportModel.r_item_filter"
            style="width: max-content"
            toggle-color="secondary"
            color="grey-8"
            :options="
              ReservableItems.filter((r) =>
                ReportModel.mainr_item_filter == '*'
                  ? true
                  : r.value == '*'
                  ? true
                  : r.type == ReportModel.mainr_item_filter
              )
            "
          ></q-btn-toggle>
        </q-scroll-area>
      </div>
      <div
        class="col-6"
        v-for="(order, index) in PendingOrders.filter((o) => FilterOrdersFn(o))"
        :key="index"
      >
        <q-card>
          <q-card-section class="text-white bg-teal-8">
            <div class="text-h6">
              {{ GetOrderReservedItemFn(order.r_items).item }}
            </div>
            <div class="flex justify-between">
              <div class="text-subtitle3">COP: {{ order.count_of_person }}</div>
              <div class="text-subtitle3 text-grey-5">
                {{
                  getHumanReadableDateDifference(
                    +new Date(order.created_at),
                    +new Date()
                  )
                }}
                ago
              </div>
            </div>
            <div class="text-subtitle2">
              ID: <code> {{ order.order_no }} </code>
            </div>
          </q-card-section>
          <q-separator />

          <q-card-actions>
            <q-avatar
              icon="check"
              color="secondary"
              text-color="white"
              size="20px"
              class="q-mr-md"
              v-if="order.status == 1"
            />
            <q-avatar
              icon="priority_high"
              color="red"
              text-color="white"
              size="20px"
              class="q-mr-md"
              v-else
            />
            <q-btn-group flat rounded="">
              <q-btn
                flat
                color="orange"
                round
                dense
                @click="CancelConfirmationFn(order.id, index)"
                icon="cancel_schedule_send"
              />
            </q-btn-group>
            <q-space />
            <q-btn-group flat>
              <q-btn
                flat
                round
                dense
                :disabled="order.r_items.length == 0"
                @click="OpenReserveItemDialogFn(order)"
                icon="edit_location_alt"
              />
              <q-btn
                flat
                dense
                icon="list_alt"
                @click="
                  (OrderDetails = order.details),
                    (ReportModel.DetailsDialog = true),
                    (ReportModel.order_id = order.id)
                "
              />
              <q-btn
                flat
                dense
                v-if="order.status == 0"
                color="primary"
                @click="
                  (ReportModel.ReadyDialog = true),
                    (ReportModel.order_id = order.id),
                    (ReportModel.order_index = index)
                "
              >
                Ready
              </q-btn></q-btn-group
            >
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="ReportModel.CancelDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Are you sure!</div>
          <small>Write the reason</small>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            color="dark"
            type="textarea"
            v-model="ReportModel.reason"
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="green" flat label="back" v-close-popup />
          <q-btn
            color="red"
            @click="CancelOrderFn"
            flat
            label="Yes"
            :loading="ReportModel.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ReportModel.ReadyDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="gpp_good" color="dark" text-color="white" />
          <span class="q-ml-sm">Are you sure order is ready!</span>
          <q-banner
            inline-actions
            rounded
            dense
            class="bg-orange text-dark q-ml-xl"
            v-if="SystemInfos.is_direct_to_sale_via_mobile"
          >
            Order will be paid directly
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn
            flat
            label="Yes Sure"
            color="secondary"
            :loading="ReportModel.loading"
            @click="submitOrderFn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="ReportModel.DetailsDialog" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Order Details</div>
        </q-card-section>

        <q-card-section>
          <form
            @submit.prevent="onSubmit"
            class="row q-col-gutter-y-sm q-col-gutter-x-sm"
          >
            <div class="col-12">
              <q-scroll-area style="width: 100%; height: 55px">
                <q-btn-toggle
                  v-if="RawItems.length"
                  class="q-ma-sm"
                  toggle-color="secondary"
                  color="grey-8"
                  style="width: max-content; margin-top: 5px"
                  v-model="ModelForm.category"
                  :options="ItemCategories"
                ></q-btn-toggle>
              </q-scroll-area>
            </div>
            <div class="col-8">
              <q-select
                label=" Item *"
                square
                color="secondary"
                use-input
                filled
                clearable=""
                dense
                @filter="filterItemFn"
                :options="StockItems"
                v-model="ModelForm.item"
                :readonly="ModelForm.is_update"
                input-debounce="0"
                :error="ModelForm.Validation.item"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-avatar>
                        <q-img :src="scope.opt.image" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.type }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="col-4">
              <q-input
                :error="ModelForm.Validation.quantity"
                square
                color="secondary"
                class="center counter-input"
                dense
                flat
                step="0.00001"
                type="number"
                v-model="ModelForm.quantity"
              >
                <template #after>
                  <q-btn
                    icon="add"
                    dense
                    @click="ModelForm.quantity = Number(ModelForm.quantity) + 1"
                  />
                </template>
                <template #before>
                  <q-btn
                    icon="remove"
                    dense
                    @click="
                      ModelForm.quantity = Number(ModelForm.quantity) - 0.5
                    "
                  />
                </template>
              </q-input>
            </div>

            <div class="col-7">
              <q-btn-group style="width: 100%">
                <q-btn
                  :loading="ModelForm.StoreLoading"
                  type="submit"
                  label="Save"
                  :icon="ModelForm.is_update ? 'save_as' : 'save'"
                  size="md"
                  push
                  style="width: 50%"
                  :color="ModelForm.is_update ? 'dark' : 'secondary'"
                />

                <q-btn
                  @click="ModelForm.ClearModel()"
                  label="Reset"
                  icon="refresh"
                  size="md"
                  style="width: 50%"
                  color="red-4"
                />
              </q-btn-group>
            </div>
          </form>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 60vh; height: 50vh" class="scroll">
          <q-list bordered class="rounded-borders" style="max-width: 600px">
            <q-item-label header>Selected Items</q-item-label>

            <q-item v-for="(item, index) in OrderDetails" :key="index">
              <q-item-section avatar top>
                <q-img :src="item.item.image" />
              </q-item-section>

              <q-item-section top>
                <q-item-label lines="1">
                  <span class="text-weight-medium"> {{ item.item.name }} </span>
                </q-item-label>
                <q-item-label caption>
                  Price: <code>{{ item.price }}</code>
                </q-item-label>
                <q-item-label caption>
                  Quantity: <code>{{ item.quantity }}</code>
                </q-item-label>
              </q-item-section>

              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    size="12px"
                    @click="DeleteOrderItem(item, index)"
                    flat
                    dense
                    round
                    :loading="item.loading"
                    icon="delete"
                  />
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="edit"
                    @click="
                      (ModelForm.id = item.id),
                        (ModelForm.is_update = true),
                        (ModelForm.item = RawItems.filter(
                          (i) => i.id == item.item_id
                        )[0]),
                        (ModelForm.quantity = item.quantity)
                    "
                  />
                </div>
              </q-item-section>
            </q-item>

            <q-separator spaced />
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="close" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="ReportModel.ReserveItemsDialog"
      full-width
      full-height=""
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Order Reserve Items</div>
        </q-card-section>

        <q-card-section>
          <div class="col-12">
            <div class="text-h6">Tables</div>
            <q-list style="overflow-y: auto; height: 70vh" class="r_list">
              <q-item
                tag="label"
                v-ripple
                v-for="(item, index) in ReservableItems.filter(
                  (item) => item.value != '*'
                )"
                :key="index"
                :active="item.is_selected"
                active-class="bg-grey-6 text-dark text-bold"
              >
                <q-item-section side top>
                  <q-checkbox
                    v-model="item.is_selected"
                    @update:model-value="
                      $event
                        ? ReportModel.r_items.push({
                            id: item.id,
                            price: item.price,
                          })
                        : ReportModel.r_items.splice(
                            ReportModel.r_items.findIndex(
                              (i) => i.id == item.id
                            ),
                            1
                          )
                    "
                    color="secondary"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>
                    <div>{{ item.price }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="close" color="red" v-close-popup />
          <q-btn
            flat
            label="Save"
            :loading="ReportModel.loading"
            @click="ChangeOrderReseveItemFn"
            color="primary"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { SendActionRequest, SendResourceRequest } from "src/boot/helpers";
import { ref, onBeforeMount, reactive, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import ValidateForm from "src/Utils/Validator";

const $q = useQuasar();

const ReportModel = reactive({
  CancelDialog: false,
  ReadyDialog: false,
  reason: null,
  loading: false,
  order_id: null,
  order_index: null,
  DetailsDialog: false,
  ReserveItemsDialog: false,
  r_item_filter: "*",
  mainr_item_filter: "*",
  r_items: [],
  ResetModel: function () {
    this.reason = null;
    this.order_index = null;
    this.order_id = null;
    this.ReadyDialog = false;
    this.CancelDialog = false;
  },
});

const SystemInfos = JSON.parse(localStorage.getItem("system_info"));

const ReservableItems = ref([]);
const MainRItems = ref([]);

const PendingOrders = ref([]);
const OrderDetails = ref([]);

const ItemCategories = ref([]);
let RawItems = [];
const StockItems = ref([]);

const ModelForm = reactive({
  item: null,
  quantity: 1,
  is_update: false,
  id: null,
  category: "",
  StoreLoading: false,
  ClearModel: function () {
    this.item = null;
    this.quantity = 1;
    this.is_update = false;
    this.id = null;
    this.StoreLoading = false;
  },
  Validation: {
    quantity: false,
    item: false,
  },
});

const GetOrderReservedItemFn = (r_items) => {
  if (r_items.length == 0)
    return {
      item: "",
      image_url: "http://192.168.10.2/storage/photos/null-reserve-item.png",
    };

  let image_url = "";
  const item = r_items[0].r_item;
  switch (item.type) {
    case "Room":
      image_url = "http://192.168.10.2/bed.png";
      break;
    case "Table":
      image_url = "http://192.168.10.2/table.png";
      break;
    case "Cafe":
      image_url = "http://192.168.10.2/cafe.png";
      break;
    case "VIP Room":
      image_url = "http://192.168.10.2/vip.png";
      break;
    case "Hall":
      image_url = "http://192.168.10.2/conference.png";
      break;
    case "Home":
      image_url = "http://192.168.10.2/house.png";
  }

  return {
    item: item.name,
    image_url: image_url,
  };
};

const CancelConfirmationFn = (id, index) => {
  ReportModel.order_id = id;
  ReportModel.order_index = index;
  ReportModel.CancelDialog = true;
};

const CancelOrderFn = () => {
  ReportModel.loading = true;

  const Config = SendActionRequest(
    {
      _class: "POSActions",
      _method_name: "cancel_order",
    },
    {
      order_id: ReportModel.order_id,
      reason: ReportModel.reason,
    }
  );

  api
    .post(Config.url, Config.payload)
    .then((Response) => {
      PendingOrders.value.splice(ReportModel.order_index, 1);

      ReportModel.ResetModel();
      $q.notify({
        message: "Order Has Been Canceled",
        position: "top",
        color: "green",
      });
    })
    .catch((Error) => {
      $q.notify({
        message: Error.response?.data?.message,
        position: "top",
        color: "red",
      });
    })
    .finally(() => (ReportModel.loading = false));
};

const submitOrderFn = () => {
  ReportModel.loading = true;

  const items = PendingOrders.value[ReportModel.order_index].details.map(
    (item) => {
      return {
        id: item.item.id,
        ingredients: item.sub_details.map((i) => {
          return {
            id: i.id,
            item: i.stock_item_id ? { id: i.stock_item_id } : i.name,
            name: i.name,
            profit: i.profit,
            quantity: i.quantity,
            price: i.price,
            order_id: i.id,
          };
        }),
        quantity: item.quantity,
        price: item.item.price,
        type: item.item.type,
        name: item.item.name,
        image: item.item.image,
      };
    }
  );

  const profit_amount = items.reduce(
    (p, c) =>
      p +
      Number(
        c.ingredients.length
          ? c.ingredients.reduce((ip, ic) => ip + ic.profit * ic.quantity, 0) *
              c.quantity
          : c.price.profit * c.quantity
      ),
    0
  );

  const Config = SendActionRequest(
    {
      _class: "POSActions",
      _method_name: "submit_order_from_kot",
    },
    {
      order_id: ReportModel.order_id,
      is_paid: SystemInfos.is_direct_to_sale_via_mobile,
      items,
      profit_amount,
    }
  );

  api
    .post(Config.url, Config.payload)
    .then((Response) => {
      PendingOrders.value.splice(ReportModel.order_index, 1);

      ReportModel.ResetModel();

      $q.notify({
        message: "Order Has Been Submited",
        position: "top",
        color: "green",
      });
    })
    .catch((Error) => {
      $q.notify({
        message: Error.response?.data?.message,
        position: "top",
        color: "red",
      });
    })
    .finally(() => (ReportModel.loading = false));
};

onBeforeMount(async () => {
  if (!PendingOrders.value.length) LoadOrders();
  LoadData();
  if (!ReservableItems.value.length)
    api
      .get(
        SendResourceRequest({
          _class: "SettingsResources",
          _method_name: "get_reservable_item_resource",
        })
      )
      .then((Response) => {
        ReservableItems.value = [
          {
            value: "*",
            label: "All",
          },

          ...Response.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
              price: item.price,
              is_selected: false,
              name: item.name,
              status: item.status == "Available" ? 1 : 0,
              type: item.type,
              id: item.id,
            };
          }),
        ];

        const set = new Set([...Response.data.data.map((i) => i.type)]);

        MainRItems.value = [
          { value: "*", label: "All" },
          ...Array.from(set.values()).map((item, index) => {
            return {
              value: item,
              label: item,
            };
          }),
        ];

        sortByKey(ReservableItems.value, "name");
      });
});

const OpenReserveItemDialogFn = (order) => {
  ReportModel.order_id = order.id;
  ReportModel.ReserveItemsDialog = true;
  ReservableItems.value.forEach((item) => {
    if (item.id == order.r_items[0].r_item_id) {
      item.is_selected = true;
      ReportModel.r_items = [
        {
          id: item.id,
          price: item.price,
        },
      ];
    } else {
      item.is_selected = false;
    }
  });
};

const ChangeOrderReseveItemFn = () => {
  if (ReportModel.r_items.length) {
    ReportModel.loading = true;
    const Config = SendActionRequest(
      {
        _class: "POSActions",
        _method_name: "change_order_reserve_item",
      },
      {
        order_id: ReportModel.order_id,
        r_item: ReportModel.r_items[0],
      }
    );
    api
      .post(Config.url, Config.payload)
      .then((Response) => {
        ReportModel.ReserveItemsDialog = false;
        ReportModel.r_items = [];

        LoadOrders();
        $q.notify({
          message: `Order Reserve Item Has Been Changed`,
          color: "green",
          position: "top",
        });
      })
      .catch((Error) => {
        $q.notify({
          message: Error.response.data.message,
          color: "red",
          position: "top",
        });
      })
      .finally(() => (ReportModel.loading = false));
  }
};

var $Timer = window.setInterval(function () {
  LoadOrders();
}, 10000);

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

onUnmounted(() => window.clearInterval($Timer));

const LoadOrders = () => {
  api
    .get(
      SendResourceRequest({
        _class: "POSResources",
        _method_name: "get_orders_of_counter",
      })
    )
    .then((Response) => {
      PendingOrders.value = Response.data.data;
    });
};

function getHumanReadableDateDifference(startDate, endDate) {
  const timeDifference = Math.abs(endDate - startDate);

  // Calculate individual time components
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Determine the most significant time unit
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  }
}

const onSubmit = () => {
  let vd = new ValidateForm(ModelForm, {
    item: ["required", ""],
    quantity: ["required", ""],
  });
  vd.validate();
  if (vd.is_form_valid) {
    ModelForm.StoreLoading = true;
    const Config = SendActionRequest(
      {
        _class: "POSActions",
        _method_name: ModelForm.is_update
          ? "edit_item_of_order"
          : "add_new_item_to_order",
      },
      {
        order_item_id: ModelForm.id,
        id: ModelForm.item.id,
        quantity: ModelForm.quantity,
        order_id: ReportModel.order_id,
        ingredients: ModelForm.item.ingredients.map((item, i) => {
          return {
            id: i + 1,
            item: item.stock_item_id ? { id: item.stock_item_id } : item.name,
            name: item.name,
            price: item.price,
            profit: item.profit,
            quantity: item.quantity,
          };
        }),
        price: ModelForm.item.price,
        total_price:
          ModelForm.item.ingredients.length > 0
            ? ModelForm.item.ingredients.reduce(
                (p, c) => p + (Number(c.price) + Number(c.profit) * c.quantity),
                0
              )
            : Number(ModelForm.item.price.price) +
              Number(ModelForm.item.price.profit),
      }
    );

    api
      .post(Config.url, Config.payload)
      .then((Response) => {
        OrderDetails.value = Response.data;
        ModelForm.ClearModel();
        $q.notify({
          message: `Item has been added to order`,
          color: "green",
          position: "top",
        });
      })
      .catch((Error) => {
        $q.notify({
          message: Error.response.data.message,
          color: "red",
          position: "top",
        });
      })
      .finally(() => (ModelForm.StoreLoading = false));
  }
};

const LoadData = async () => {
  if (!ItemCategories.value.length)
    api
      .get(
        SendResourceRequest({
          _class: "InventoryResources",
          _method_name: "get_categories_as_options",
        })
      )
      .then((Response) => {
        ItemCategories.value = Response.data.data;
        ModelForm.category = ItemCategories.value[1]?.value;
      })
      .then(() => {
        api
          .get(
            SendResourceRequest({
              _class: "InventoryResources",
              _method_name: "get_saleble_items_as_options",
            })
          )
          .then((Response) => {
            StockItems.value = RawItems = Response.data.data;
            ItemCategories.value = ItemCategories.value.filter((category) =>
              Response.data.data.some(
                (item) => item.category_id == category.value
              )
            );
          });
      });
};

const FilterOrdersFn = (order) => {
  if (ReportModel.r_item_filter == "*") {
    return ReportModel.filter != null && ReportModel.filter != ""
      ? (order.r_items.length == 0
          ? false
          : order.r_items[0].r_item.name
              .toLowerCase()
              .indexOf(ReportModel.filter.toString().toLowerCase()) > -1) ||
          order.order_no == ReportModel.filter
      : order.r_items[0]?.r_item?.type == ReportModel.mainr_item_filter;
  } else if (ReportModel.r_item_filter != "*") {
    return (
      order.r_items.length > 0 &&
      order.r_items[0].r_item_id == ReportModel.r_item_filter &&
      (ReportModel.filter != null && ReportModel.filter != ""
        ? (order.r_items.length == 0
            ? false
            : order.r_items[0].r_item.name
                .toLowerCase()
                .indexOf(ReportModel.filter.toString().toLowerCase()) > -1) ||
          order.order_no == ReportModel.filter
        : true)
    );
  }

  return false;
};

const filterItemFn = (val, update) => {
  if (val === "") {
    update(() => {
      StockItems.value = RawItems.filter(
        (item) =>
          !OrderDetails.value.some((i) => i.item_id == item.value) &&
          item.category_id == ModelForm.category
      );

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();

    StockItems.value = RawItems.filter(
      (v) =>
        v.label.toLowerCase().indexOf(needle) > -1 &&
        !OrderDetails.value.some((i) => i.item_id == v.value) &&
        v.category_id == ModelForm.category
    );
  });
};

const DeleteOrderItem = (item, index) => {
  item.loading = true;
  const Config = SendActionRequest(
    {
      _class: "POSActions",
      _method_name: "delete_order_item",
    },
    {
      item_id: item.id,
      order_id: ReportModel.order_id,
      wantsData: false,
      total_price: item.quantity * item.price,
    }
  );

  api
    .post(Config.url, Config.payload)
    .then((Response) => {
      OrderDetails.value.splice(index, 1);
      $q.notify({
        message: "Order Item Has Been Deleted ",
        color: "green",
      });
    })
    .finally(() => (item.loading = false));
};
</script>
