sap.ui.define(
    [
        "sap/ui/core/mvc/Controller" 
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("logaligroup.employees.controller.Base", {  
         
        onInit: function() { // carga dos modelos, uno con propiedades y otro retorna y lista directamente
 
        },  
      
        toOrderDetails(oEvent) {
            var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
            oRouter.navTo("RouteOrderDetails",{
                OrderID: orderID 
            });
        }
      });
    }
);
  