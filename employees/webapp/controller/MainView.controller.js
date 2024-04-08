sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator" 
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            var oJSONModel = new sap.ui.model.json.JSONModel();
            var oView = this.getView();
            var i18nBundle =  this.getOwnerComponent().getModel("i18n").getResourceBundle();

            // var oJSON = {
            //     employeeId: "12345",
            //     countryKey: "UK",
            //     listCountry: [
            //         {
            //             key: "US",
            //             text: i18nBundle.getText("countryUS")
            //         },
            //         {
            //             key: "UK",
            //             text: i18nBundle.getText("countryUK")
            //         },
            //         {
            //             key: "ES",
            //             text: i18nBundle.getText("countryES")
            //         }
            //     ]
            // };

            // oJSONModel.setData(oJSON); //setData cuando el objeto se crea aqui mismo y no en un fichero local
            oJSONModel.loadData("./localService/mockData/Employees.json", false); //carga de datos, y false para que espere a cargar todos los datos
            // oJSONModel.attachRequestCompleted(function (oEventModel) {
            //     console.log(JSON.stringify(oJSONModel.getData()));
            // });
            oView.setModel(oJSONModel);
        }

        function onFilter() {
            var oJSON = this.getView().getModel().getData();
            
            var filters = [];

            if (oJSON.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            }

            if (oJSON.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }
        
        function onClearFilter() {
            var oModel = this.getView().getModel();
            oModel.setProperty("/EmployeeId","");
            oModel.setProperty("/CountryKey","");
        }

        function myCheck() {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                // inputEmployee.setDescription("Ok");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                // inputEmployee.setDescription("Not Ok");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }
        }

        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource(); //obtenemos el item que se ha pulsado
            var oContext = itemPressed.getBindingContext(); //obtenemos el contexto
            var objectContext = oContext.getObject(); //obtenemos el objeto sobre el contexto

            sap.m.MessageToast.show(objectContext.PostalCode);
 
        }

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: onInit,
            onValidate: myCheck,
            onClearFilter:onClearFilter,
            onFilter: onFilter,
            showPostalCode: showPostalCode
        });
    });
