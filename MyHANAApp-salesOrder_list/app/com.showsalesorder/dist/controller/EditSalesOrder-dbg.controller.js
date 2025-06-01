sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], (Controller, JSONModel, MessageBox, Filter,FilterOperator, Sorter) => {
    "use strict";

    return Controller.extend("com.showsalesorder.controller.EditSalesOrder", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteEditSalesOrder").attachPatternMatched(this.onPatternMatched,this);

        },
        onPatternMatched:function(oEvent){
            var soNumber =  oEvent.getParameter("arguments").soNumber;
            this.getView().bindElement(`/Interactions_SalesOrders(soNumber='${soNumber}',IsActiveEntity='true')`);
         },
        
         onPressBack: function(){
            history.go(-1);

        },
        // onPressSave:function(){
        //     var soNumber = this.byId("idsoNumber").getValue();
        //     var orderDate = this.byId("idorderDate").getValue();
        //     var customerName = this.byId("idcustomerName").getValue();
        //     var customerNumber = this.byId("idcustomerNumber").getValue();
        //     var PoNumber = this.byId("idPoNumber").getValue();
        //     var inquiryNumber = this.byId("idinquiryNumber").getValue();
        //     var totalOrderItems = this.byId("idtotalOrderItems").getValue();

        //     var payload = {
        //         "soNumber": soNumber,
        //         "orderDate": orderDate,
        //         "customerName": customerName,
        //         "customerNumber": customerNumber,
        //         "PoNumber": PoNumber,
        //         "inquiryNumber": inquiryNumber,
        //         "totalOrderItems": totalOrderItems
        //     };
        //     var oModel = this.getOwnerComponent().getModel();    
  
        //     // oModel.setUseBatch(false);
        //     oModel.update(`/Interactions_SalesOrders(soNumber='${soNumber}',IsActiveEntity='true')`,payload,{
        //         success:function(){
        //             MessageBox.success(`${soNumber} - updated successfully`);
        //             oModel.refresh(true);
        //         },
        //         error:function(oError){
        //             MessageBox.error(JSON.parse(oError.responseText).error.message.value);
        //         }
        //     });
        // },
        // onPressCancel: function(){
        //      this.getOwnerComponent().getRouter().navTo("RouteSalesOrderList");
        // }
    });
});