sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/Text"
], (Controller, JSONModel, MessageBox, MessageToast, Filter,FilterOperator, Sorter, ColumnListItem, Input, Text) => {
    "use strict";

    return Controller.extend("com.showsalesorder.controller.SalesOrderList", {
        onInit() {
            this.oEditableTemplate = new ColumnListItem({
                cells:[
                    new Input({value:"{soNumber}", change:[this.onInputChange, this]}),
                    new Input({value:"{customerName}", change:[this.onInputChange, this]}),
                    new Input({value:"{customerNumber}", change:[this.onInputChange, this]}),
                    new Input({value:"{orderDate}", change:[this.onInputChange, this]}),
                    new Input({value:"{PoNumber}", change:[this.onInputChange, this]}),
                    new Input({value:"{inquiryNumber}", change:[this.onInputChange, this]}),
                    new Input({value:"{totalOrderItems}", change:[this.onInputChange, this]})
                    // new Text({text:"{totalOrderItems}"})
                ]
            })
            this.oSaveTemplate = new ColumnListItem({
              cells:[
                new Text({text:"{soNumber}"}),
                new Text({text:"{customerName}"}),
                new Text({text:"{customerNumber}"}),
                new Text({text:"{orderDate}"}),
                new Text({text:"{PoNumber}"}),
                new Text({text:"{inquiryNumber}"}),
                new Text({text:"{totalOrderItems}"})
              ]  
            })
        },       
        onPressGo: function(oEvent){
            var CustomerNameInput = this.byId("idCustName").getValue();
            var PONumberInput = this.byId("idPoNo").getValue();
            var soNumberInput = this.byId("idSONo").getValue();
           
            var aFilter = [];
            if(CustomerNameInput){
                var oFilter = new Filter("customerName", FilterOperator.Contains, CustomerNameInput)  ;
                aFilter = [...aFilter, oFilter];
            };
            if(PONumberInput){
                var oFilter = new Filter("PoNumber", FilterOperator.EQ, PONumberInput)  ;
                aFilter = [...aFilter, oFilter];
            };
            if(soNumberInput){
                var oFilter = new Filter("soNumber", FilterOperator.EQ, soNumberInput)  ;
                aFilter = [...aFilter, oFilter];
            };

            this.byId("idSalesTable").getBinding("items").filter(aFilter);
        },
        onPressReset: function(oEvent){
            this.byId("idCustName").setValue("");
            this.byId("idPoNo").setValue("");
            this.byId("idSONo").setValue("");
            this.byId("idSalesTable").getBinding("items").filter([]);
        },
        getTodayDate:function(){
            var today = new Date();
            var day = today.getDate().toString().padStart(2,'0');
            var month = (today.getMonth()+1).toString().padStart(2,'0');
            var year = today.getFullYear();
            // return `${day}/${month}/${year}`;
            return `${year}-${month}-${day}`;
        },
        onPressSave:function(){
            var soNumber = this.byId("idsoNumber").getValue();
            // var orderDate = this.byId("idorderDate").getValue();
            var orderDate = this.getTodayDate();
            var customerName = this.byId("idcustomerName").getValue();
            var customerNumber = this.byId("idcustomerNumber").getValue();
            var PoNumber = this.byId("idPoNumber").getValue();
            var inquiryNumber = this.byId("idinquiryNumber").getValue();
            var totalOrderItems = this.byId("idtotalOrderItems").getValue();
            var that = this ;
            var payload = {
                "soNumber": soNumber,
                "orderDate": orderDate,
                "customerName": customerName,
                "customerNumber": customerNumber,
                "PoNumber": PoNumber,
                "inquiryNumber": inquiryNumber,
                "totalOrderItems": totalOrderItems
            };
            var oModel = this.getOwnerComponent().getModel();    
            this.byId("idSalesTable").getBinding("items").create(
                {
                    soNumber: payload["soNumber"],
                    orderDate:payload["orderDate"],
                    customerName:payload["customerName"],
                    customerNumber: payload["customerNumber"],
                    PoNumber: payload["PoNumber"],
                    inquiryNumber: payload["inquiryNumber"],
                    totalOrderItems: payload["totalOrderItems"]
                }
            ).created().then(function(){
                that.doInputValueClear();
                MessageBox.success(`${payload["soNumber"]} is created`);
            }).catch(function(err){
                MessageBox.error(err);
            })
  
            // oModel.setUseBatch(false);
            // oModel.update(`/Interactions_SalesOrders(soNumber='${soNumber}',IsActiveEntity='true')`,payload,{
            //     success:function(){
            //         MessageBox.success(`${soNumber} - updated successfully`);
            //         oModel.refresh(true);
            //     },
            //     error:function(oError){
            //         MessageBox.error(JSON.parse(oError.responseText).error.message.value);
            //     }
            // });
        },
        doInputValueClear: function(){
            this.byId("idsoNumber").setValue("");
            this.byId("idcustomerName").setValue("");
            this.byId("idcustomerNumber").setValue("");
            this.byId("idPoNumber").setValue("");
            this.byId("idinquiryNumber").setValue("");
            this.byId("idtotalOrderItems").setValue("");
            // this.byId("idCustName").setValue("");
        },
        onPressCancel: function(){
            this.doInputValueClear();    
        },
        onPressCreate:function(oEvent){
        },
        onSalesOrderChange:function(oEvent){
            //   var soNumber =   oEvent.getParameter("listItem").getBindingContext().sPath.split("(")[1].split(")")[0];
              var soNumber =   oEvent.getParameter("listItem").getBindingContext().getProperty("soNumber");
            //   this.byId("_IDPEdit").setText(`Edit SO - ${soNumber}`);
              this.byId("_IDPDelete").setEnabled(true);
              this.byId("_IDPDelete").setText(`Delete SO - ${soNumber}`);
        },
        // onPressEdit:function(oEvent){
        //    var soNumber =  this.byId("idSalesTable").getSelectedItem().getBindingContext().getProperty("soNumber");
        //    this.getOwnerComponent().getRouter().navTo("RouteEditSalesOrder",{
        //     soNumber:soNumber
        // });
        // },
        onPressDelete: function(oEvent){
            var oSelected = this.byId("idSalesTable").getSelectedItem();
                if(oSelected){
                    var oSalesOrder = oSelected.getBindingContext().getObject().soNumber;
                
                    oSelected.getBindingContext().delete("$auto").then(function () {
                        MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                    }.bind(this), function (oError) {
                        MessageToast.show("Deletion Error: ",oError);
                    });
                } else {
                    MessageToast.show("Please Select a Row to Delete");
                }
                this.byId("_IDPDelete").setEnabled(false);
                this.byId("_IDPDelete").setText(`Delete SO`);
        },
        rebindTable:function(oTemplate, skeyboardMode){
            this.byId("idSalesTable").bindItems({
                path:"/Interactions_SalesOrders",
                template:oTemplate,
                templateShareable:true
            }).setKeyboardMode(skeyboardMode)
        },
        onPressEdit:function(oEvent){
            console.log("onPressEdit")
            this.byId("_IDPDelete").setEnabled(false);
            this.rebindTable(this.oEditableTemplate, "Edit");
        },
        onPressEditSave:function(oEvent){
            console.log("onPressEditSave");
            this.refreshModel();
            this.rebindTable(this.oSaveTemplate, "Navigation");
            // this.byId("idSalesTable").bindElement("/Interactions_SalesOrders");     " this will not work as the binding got changed by onpressEdit"
            // this.getOwnerComponent().getModel().refresh();

        },
        makeChangesAndSubmit:function(resolve, reject){
            const that = this;
            var sGroup = "$auto";
            if(that.getView().getModel().hasPendingChanges(sGroup)){
                that.getView().getModel().submitBatch(sGroup).then(
                    (oSuccess)=>{
                       that.makeChangesAndSubmit(resolve, reject) ;
                       MessageToast.show("Record Updated Successfully");
                    }
                ).catch((err)=>{MessageToast.show("Something went wrong", err.message)})
            }else{
                that.getView().getModel().refresh(sGroup);
                resolve();
            }
        },
        refreshModel:function(){
            return new Promise((resolve, reject)=>{
                this.makeChangesAndSubmit.call(this, resolve, reject);
            })
        },
        onInputChange:function(){
            this.refreshModel();
        },
        
        onPressNav:function(oEvent){

        }

    });
});