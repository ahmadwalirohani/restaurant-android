
function closePrint(){
  document.body.removeChild(this.__container__)
}
function setPrint(str){
  this.contentWindow.__container__ = this
  this.contentWindow.document.getElementById("body").innerHTML = str
  this.contentWindow.onbeforeunload = closePrint
  this.contentWindow.onafterprint = closePrint
  this.contentWindow.focus()
  this.contentWindow.print()
}
export default async function print(curl, Data){
  var iframe = document.createElement("iframe")
  iframe.onload = function(){
    this.contentWindow.__container__ = this
    for (const key in Data) {
      if (Object.hasOwnProperty.call(Data, key)) {
        this.contentWindow.document.getElementById(key).innerHTML = typeof Data[key] == 'function' ? Data[key](): Data[key]
      }
    }
    this.contentWindow.onbeforeunload = closePrint
    this.contentWindow.onafterprint = closePrint
    this.contentWindow.focus()
    this.contentWindow.print()
  }
  iframe.style.position = "fixed"
  iframe.style.bottom = "0"
  iframe.style.right = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "0"
  iframe.src = curl
  document.body.appendChild(iframe)
}
