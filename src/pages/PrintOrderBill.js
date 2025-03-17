export default function PrintOrderBill(infos = {}, items = []) {
  const SystemInfos = JSON.parse(localStorage.getItem("system_info"));

  let template = `
  <!doctype html>
<html>
  <head>

    <style>
    .receipt {
  font-family: "Calibri", sans-serif !important;
  width: 80mm; /* Adjust this to fit your paper width */
  margin: 0 auto;
  padding: 2mm;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}
.header {
  text-align: center;
}
.header img {
  max-width: 100px;
  height: auto;
}

.body {
  margin-top: 10px;
}
.person-info,
.transaction-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.person-info h4,
.transaction-info h4,
.total-balance h4 {
  font-size: 16px;
  color: black;
}
.footer {
  margin-top: 10px;
  border-top: 2px solid #000;
  padding-top: 10px;
}
.total-balance {
  display: flex;
  justify-content: space-between;
}

h4,
h2,
h3,
h5,
h6,
h1 {
  font-weight: bolder;
  margin: 0px;
  line-height: 1rem !important;
}

hr {
  height: 2px;
  background-color: black;
  border: 0px;
}
table {
  width: 100%;
}

tr th,
td {
  border: 1px solid black;
}

@page {
  margin-top: 0px;
  margin-right: 5px;
  margin-bottom: 0px;
  margin-left: 0px;
  size: a6 landscape;
}
    </style>
  </head>
  <body>
  <div class="receipt" id="printOrderBill" dir="rtl" >
    <div class="header">
      <h2>${SystemInfos.company_name}</h2>
      <br />
      <h3>${SystemInfos.company_phone}</h3>
      <hr />
      <h4>ارډر بیل</h4>
    </div>
    <div class="body">
      <div class="person-info">
        <h4>شمیره:</h4>
        <h4 id="name">${infos?.bill_no}</h4>
      </div>
      <div class="person-info">
        <h4>یوزر نوم:</h4>
        <h4 id="phone">
          ${infos?.customer} &nbsp;&nbsp;| ${infos?.user}
        </h4>
      </div>
      <div class="transaction-info">
        <h4>تاریخ:</h4>
        <h4 dir="ltr">${new Date().toLocaleString("en-ZA")}</h4>
      </div>
      <div class="transaction-info">
        <h4>موقیعت:</h4>
        <h4>${infos?.r_item}</h4>
      </div>
       <div class="transaction-info">
        <h4>نفر تعداد:</h4>
        <h4>${infos?.cop}</h4>
      </div>
      ${
        infos.is_pick_order
          ? `
         <div class="transaction-info">
            <h4> مبایل شمیره:</h4>
            <h4 dir="ltr">${infos?.phone}</h4>
          </div>
          <div class="transaction-info">
            <h4> ادرس:</h4>
            <h4 >${infos?.address}</h4>
          </div>
        `
          : ""
      }
      <hr />

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>جنس</th>
            <th>مقدار</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(function (item, i) {
              return `
              <tr">
            <th>${i + 1}</th>
            <th>${item.name}</th>
            <th>${new Intl.NumberFormat("en").format(item.quantity)}</th>
          </tr>
              `;
            })
            .join(" ")}
        </tbody>
      </table>
    </div>
    <div class="footer">
    <p> ${infos.remarks} </p>
      <hr />
      <center>
        <b>${SystemInfos.company_address}</b>
      </center>
      <hr />
    </div>
  </div>

  </body>
</html>`;

  // get all stylesheets html

  var WinPrint = window.open("", "", "popup");

  WinPrint.document.write(template);
  WinPrint.document.close();
  WinPrint.focus();

  WinPrint.print();

  WinPrint.close();
}
