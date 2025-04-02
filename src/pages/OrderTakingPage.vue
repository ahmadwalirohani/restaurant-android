<template>
  <q-page>
    <div class="row q-col-gutter-x-md q-col-gutter-y-md">
      <div class="col-6">
        <q-input
          label="Order ID"
          v-model="FormModel.order_id"
          dense
          filled
          readonly
        />
      </div>
      <div class="col-6">
        <q-input
          label="Count Of Person"
          v-model="FormModel.count_of_person"
          dense
          filled
        />
      </div>
      <div class="col-12 row">
        <q-btn
          @click="FormModel.count_of_person += '1'"
          style="width: 8%"
          label="1"
        />
        <q-btn
          @click="FormModel.count_of_person += '2'"
          style="width: 8%"
          class="q-ml-sm"
          label="2"
        />
        <q-btn
          @click="FormModel.count_of_person += '3'"
          style="width: 8%"
          class="q-ml-sm"
          label="3"
        />
        <q-btn
          @click="FormModel.count_of_person += '4'"
          style="width: 8%"
          class="q-ml-sm"
          label="4"
        />
        <q-btn
          @click="FormModel.count_of_person += '5'"
          style="width: 8%"
          class="q-ml-sm"
          label="5"
        />
        <q-btn
          @click="FormModel.count_of_person += '6'"
          style="width: 8%"
          class="q-ml-sm"
          label="6"
        />
        <q-btn
          @click="FormModel.count_of_person += '7'"
          style="width: 8%"
          class="q-ml-sm"
          label="7"
        />
        <q-btn
          @click="FormModel.count_of_person += '8'"
          style="width: 8%"
          class="q-ml-sm"
          label="8"
        />
        <q-btn
          @click="FormModel.count_of_person += '9'"
          style="width: 8%"
          class="q-ml-sm"
          label="9"
        />
        <q-btn
          @click="FormModel.count_of_person += '0'"
          style="width: 8%"
          class="q-ml-sm"
          label="0"
        />
      </div>
      <q-separator
        style="padding: 0px !important; height: 1px; margin-left: 5px"
        vertical
        size="100%"
        class="q-mt-md"
        color="grey"
      />
      <div class="col-5">
        <div class="text-h6">Tables</div>
        <q-list style="overflow-y: auto" class="r_list">
          <q-item
            tag="label"
            v-ripple
            v-for="(item, index) in ReservableItem.filter(
              (item) =>
                (FormModel.item_type == '*'
                  ? true
                  : item.type == FormModel.item_type) &&
                (FormModel.item_filter == ''
                  ? true
                  : item.name
                      .toLowerCase()
                      .indexOf(FormModel.item_filter.toLowerCase()) > -1)
            )"
            :key="index"
            :active="item.is_selected"
            active-class="bg-grey-6 text-dark text-bold"
          >
            <q-item-section side top>
              <q-checkbox
                v-model="item.is_selected"
                @update:model-value="
                  ($event) => {
                    if ($event) {
                      FormModel.r_items.push({
                        id: item.id,
                        price: item.price,
                      });
                      ReservableItem = ReservableItem.map((r, i) => ({
                        ...r,
                        is_selected: i != index ? false : $event,
                      }));
                    } else {
                      FormModel.r_items.splice(
                        FormModel.r_items.findIndex((i) => i.id == item.id),
                        1
                      );
                    }
                  }
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
      <div class="col-7">
        <div class="text-h6">Items</div>
        <div class="row q-col-gutter-y-md">
          <div class="col-12">
            <q-scroll-area style="width: 100%; height: 55px">
              <q-btn-toggle
                v-if="Items.length"
                class="q-ma-sm"
                toggle-color="secondary"
                color="grey-8"
                style="width: max-content; margin-top: 5px"
                v-model="FormModel.category"
                :options="ItemCategories"
              ></q-btn-toggle>
            </q-scroll-area>
          </div>
          <div
            class="col-12"
            style="height: 50vh !important ; overflow: auto; margin: auto"
          >
            <q-card
              class="my-card q-mb-md"
              v-for="(item, index) in Items.filter((item) =>
                FormModel.category == '*'
                  ? true
                  : item.category_id == FormModel.category
              )"
              :key="index"
            >
              <q-card-section horizontal>
                <q-img height="105px" width="100px" :src="item.image" />
                <div class="q-pa-sm">
                  <div class="text-lg text-bold text-blue-grey-9">
                    {{ item.name }}
                  </div>
                  <span>
                    Price :
                    {{ new Intl.NumberFormat("en").format(item.price.price) }}
                  </span>
                  <br />
                  <q-btn-group flat>
                    <q-btn
                      @click="RemoveFromCartFn(item)"
                      flat
                      :disable="!item.to_sale || item.to_sale <= 0"
                      icon="remove"
                      dense
                    >
                    </q-btn>
                    <q-input
                      dense
                      flat
                      type="number"
                      v-model="item.to_sale"
                      reverse-fill-mask
                      @update:model-value="UpdateItemQuantityFn($event, item)"
                      class="center counter-input"
                      style="width: 70px"
                    ></q-input>
                    <q-btn dense icon="add" @click="AddToCartFn(item)"></q-btn>
                  </q-btn-group>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-12">
        <q-btn
          icon="refresh"
          @click="FormModel.ClearModel()"
          label="Reset"
          class="q-mr-md"
          push
        />
        <q-btn
          icon="save"
          label="Save"
          @click="DetailsDialog = true"
          :loading="FormModel.StoreLoading"
          color="secondary"
          push
        />
      </div>
    </div>

    <q-dialog v-model="DetailsDialog" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">Order Details</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 70vh; height: 60vh" class="scroll">
          <q-list bordered class="rounded-borders" style="max-width: 600px">
            <q-item-label header>Selected Items</q-item-label>

            <q-item
              v-for="(item, index) in FormModel.selected_items"
              :key="index"
            >
              <q-item-section avatar top>
                <q-img :src="item.image" />
              </q-item-section>

              <q-item-section top>
                <q-item-label lines="1">
                  <span class="text-weight-medium"> {{ item.name }} </span>
                </q-item-label>
                <q-item-label caption>
                  Price: <code>{{ item.price.price }}</code> &nbsp;
                  <q-btn
                    @click="vPrice = Number(item.price?.price)"
                    dense
                    icon="edit"
                    v-if="system_info.is_price_editable_in_sale_order == 1"
                    size="sm"
                  >
                    <q-menu>
                      <q-input
                        autofocus
                        filled
                        label="Edit Price"
                        v-model="vPrice"
                        type="number"
                        @update:model-value="
                          ($event) => {
                            let index = FormModel.selected_items.findIndex(
                              (i) => i.id == item.id
                            );
                            FormModel.selected_items[index].price = {
                              ...FormModel.selected_items[index].price,
                              price: Number($event),
                            };
                          }
                        "
                      />
                    </q-menu>
                  </q-btn>
                </q-item-label>
                <q-item-label caption>
                  Quantity: <code>{{ item.quantity }}</code>
                </q-item-label>
              </q-item-section>

              <q-item-section top side>
                <q-input
                  class="center counter-input"
                  v-model="item.quantity"
                  dense
                  flat
                  style="width: 150px"
                >
                  <template #after>
                    <q-btn
                      dense
                      @click="
                        (item.quantity = Number(item.quantity) + 1),
                          (Items[
                            Items.findIndex((i) => i.id == item.id)
                          ].to_sale = item.quantity)
                      "
                      icon="add"
                    />
                  </template>
                  <template #before>
                    <q-btn
                      dense
                      @click="
                        (item.quantity = Number(item.quantity) - 0.5),
                          (Items[
                            Items.findIndex((i) => i.id == item.id)
                          ].to_sale = item.quantity),
                          item.quantity <= 0
                            ? FormModel.selected_items.splice(index, 1)
                            : null
                      "
                      icon="remove"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-separator spaced />
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="close" color="red" v-close-popup />
          <q-btn
            flat
            label="Confirm"
            color="primary"
            @click="StoreOrderFn"
            :loading="FormModel.StoreLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from "vue";
import { api } from "src/boot/axios";
import { SendActionRequest, SendResourceRequest } from "src/boot/helpers";
import { useQuasar } from "quasar";
import PrintOrderBill from "./PrintOrderBill";

const system_info = JSON.parse(localStorage.getItem("system_info"));
const incDecCount =
  JSON.parse(localStorage.getItem("system_info"))
    .is_item_inc_dec_integer_based == 1
    ? 1
    : 0.5;

const $quasar = useQuasar();
const vPrice = ref(null);
const Items = ref([]);
const ItemCategories = ref([]);
const ReservableItem = ref([]);
const DetailsDialog = ref(false);

const StoreOrderFn = () => {
  if (checkValidation()) {
    FormModel.StoreLoading = true;

    const isEdit = FormModel.is_edit;

    const Config = SendActionRequest(
      {
        _class: "POSActions",
        _method_name: isEdit ? "edit_order" : "store_new_order",
        _validation_class: "CreateOrderRequest",
      },
      Object.assign({}, FormModel, {
        total_amount: FormModel.selected_items.reduce(
          (p, c) => p + +(c.price.price * c.quantity),
          0
        ),
      })
    );

    api
      .post(Config.url, Config.payload)
      .then((Response) => {
        localStorage.setItem("system_info", JSON.stringify(Response.data));

        if (
          JSON.parse(localStorage.getItem("system_info"))
            .is_order_printable_via_mobile
        )
          PrintSlipFn(Config.payload);
        FormModel.ClearModel();

        DetailsDialog.value = false;
        $quasar.notify({
          message: "Order Has Been Saved",
          color: "green",
          position: "top",
        });
      })
      .catch((Error) => {
        $quasar.notify({
          message: Error.response.data?.message,
          color: "red",
          position: "top",
        });
      })
      .finally(() => (FormModel.StoreLoading = false));
  }
};

const checkValidation = () => {
  if (isOrderModelValid() && isModelValid()) return true;
  else return false;
};

const isModelValid = () => {
  if (
    FormModel.selected_items.length &&
    FormModel.selected_items.some((i) => i.quantity > 0)
  )
    return true;
  else
    $quasar.notify({
      message: "Some Item Must be Selected ",
      color: "red",
      position: "top",
    });
  return false;
};

const isOrderModelValid = () => {
  if (!FormModel.is_walkin && !FormModel.customer)
    FormModel.Validation.customer = true;
  else FormModel.Validation.customer = false;

  return !FormModel.Validation.customer;
};

const AddToCartFn = (item) => {
  item.to_sale = Number(item.to_sale || 0) + incDecCount;
  const isItem = FormModel.selected_items.findIndex((i) => i.id == item.id);
  if (isItem === -1)
    FormModel.selected_items.push({
      id: item.id,
      price: item.price,
      quantity: item.to_sale,
      name: item.name,
      type: item.type,
      image: item.image,
      ingredients:
        item.ingredients?.map((i) => {
          return {
            id: i.id,
            name: i.name,
            price: Number(i.price),
            profit: Number(i.profit),
            quantity: i.quantity || 1,
            item: i.is_stock_item
              ? {
                  id: i.stock_item.id,
                  name: i.stock_item.name,
                }
              : i.name,
          };
        }) || [],
    });
  else FormModel.selected_items[isItem].quantity = item.to_sale;
};

const RemoveFromCartFn = (item) => {
  item.to_sale = Number(item.to_sale || 0) - incDecCount;
  const isItem = FormModel.selected_items.findIndex((i) => i.id == item.id);
  if (isItem === -1)
    FormModel.selected_items.push({
      id: item.id,
      price: item.price,
      quantity: item.to_sale,
      name: item.name,
      image: item.image,
      type: item.type,
    });
  else if (item.to_sale == 0 && isItem !== -1)
    FormModel.selected_items.splice(isItem, 1);
  else FormModel.selected_items[isItem].quantity = item.to_sale;
};

const UpdateItemQuantityFn = (val, item) => {
  const isItem = FormModel.selected_items.findIndex((i) => i.id == item.id);
  if (isItem === -1)
    if (val != "" || val != 0)
      FormModel.selected_items.push({
        id: item.id,
        price: item.price,
        quantity: val,
        name: item.name,
        type: item.type,
        image: item.image,
        ingredients:
          item.ingredients?.map((i) => {
            return {
              id: i.id,
              name: i.name,
              price: Number(i.price),
              profit: Number(i.profit),
              quantity: i.quantity || 1,
              item: i.is_stock_item
                ? {
                    id: i.stock_item.id,
                    name: i.stock_item.name,
                  }
                : i.name,
            };
          }) || [],
      });
    else if (val == 0 && isItem !== -1)
      FormModel.selected_items.splice(isItem, 1);
    else if (val != 0) FormModel.selected_items[isItem].quantity = val;
};

const FormModel = reactive({
  r_items: [],
  category: "*",
  selected_items: [],
  item_type: "*",
  item_filter: "",
  order_id: JSON.parse(localStorage.getItem("system_info")).order_no,
  is_walkin: true,
  customer: null,
  count_of_person: "",
  serve_date:
    new Date().toISOString().split("T")[0] +
    " " +
    new Date().toLocaleTimeString().substr(0, 4),
  remarks: null,
  StoreLoading: false,
  is_edit: false,
  id: null,
  Validation: {
    customer: false,
  },
  ClearModel: function () {
    this.is_edit = false;
    this.id = null;
    this.count_of_person = 1;
    this.serve_date =
      new Date().toISOString().split("T")[0] +
      " " +
      new Date().toLocaleTimeString().substr(0, 4);
    this.remarks = null;
    this.customer = null;
    this.is_walkin = true;
    this.order_id = JSON.parse(localStorage.getItem("system_info")).order_no;
    this.item_filter = "";
    this.item_type = "*";
    ReservableItem.value.forEach((item) => {
      item.is_selected = false;
      this.r_items.forEach((i) => {
        if (i.id == item.id) item.status = 0;
      });
    });
    this.r_items = [];
    this.selected_items = [];
    Items.value.forEach((i) => (i.to_sale = 0));
  },
});

onBeforeMount(async () => {
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
        FormModel.category = ItemCategories.value[1]?.value;
      })
      .then(() => {
        api
          .get(
            SendResourceRequest({
              _class: "InventoryResources",
              _method_name: "get_saleble_items",
            })
          )
          .then((Response) => {
            Items.value = Response.data.data;
            ItemCategories.value = ItemCategories.value.filter((category) =>
              Response.data.data.some(
                (item) => item.category_id == category.value
              )
            );
          });
      });
  if (!ReservableItem.value.length)
    api
      .get(
        SendResourceRequest({
          _class: "SettingsResources",
          _method_name: "get_reservable_item_resource",
        })
      )
      .then((Response) => {
        ReservableItem.value = Response.data.data
          .filter((i) => i.status == "Available")
          .map((item) => {
            return {
              price: item.price,
              is_selected: false,
              name: item.name,
              status: item.status == "Available" ? 1 : 0,
              type: item.type,
              id: item.id,
            };
          });

        sortByKey(ReservableItem.value, "name");
      });
});

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

const PrintSlipFn = (order) => {
  PrintOrderBill(
    {
      customer: "Walk-in",
      user: JSON.parse(localStorage.getItem("userData")).name,
      bill_no: JSON.parse(localStorage.getItem("system_info"))?.order_no,
      r_item: ReservableItem.value.filter(
        (r) => r.id == order.r_items[0]?.id
      )[0]?.name,
      cop: order.count_of_person,
      remarks: order.remarks,
      is_pick_order: false,
      phone: order?.phone,
      address: order?.address,
    },
    order.selected_items.map((item) => {
      return {
        name: item.name,
        quantity: item.quantity,
        price: +item.price.price,
      };
    })
  );
};

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
</script>
<style scoped>
.r_list {
  height: 60vh !important;
}
.my-card {
  height: 105px;
  width: 95%;
  margin-left: 5px;
}
</style>
