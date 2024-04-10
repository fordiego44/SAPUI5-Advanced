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

        function onInit() { // carga dos modelos, uno con propiedades y otro retorna y lista directamente
            // var oJSONModel = new sap.ui.model.json.JSONModel();
            var oView = this.getView();
            // var i18nBundle =  this.getOwnerComponent().getModel("i18n").getResourceBundle();
  
            // oJSONModel.setData(oJSON); //setData cuando el objeto se crea aqui mismo y no en un fichero local
            var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
            oJSONModelEmpl.loadData("./localService/mockData/Employees.json", false); //carga de datos, y false para que espere a cargar todos los datos
            oView.setModel(oJSONModelEmpl, "jsonEmployees");
            // oJSONModel.attachRequestCompleted(function (oEventModel) {
            //     console.log(JSON.stringify(oJSONModel.getData()));
            // });
            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("./localService/mockData/Countries.json", false); //carga de datos, y false para que espere a cargar todos los datos
            oView.setModel(oJSONModelCountries, "jsonCountries");

            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
                
            });

            oView.setModel(oJSONModelConfig, "jsonModelConfig");
        }

        function onFilter() { //realiza un filtro a la lista con id y country definidos
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            
            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }

            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        }
        
        function onClearFilter() { //limpia las campos definidos de key y country
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId","");
            oModel.setProperty("/CountryKey","");
        }

        function myCheck() { // este metdo esta fuera de servicio, realizaba la validacion de numero de caracteres para mostrar u ocultar otros componentes en la vista
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
            var oContext = itemPressed.getBindingContext("jsonEmployees"); //obtenemos el contexto
            var objectContext = oContext.getObject(); //obtenemos el objeto sobre el contexto

            sap.m.MessageToast.show(objectContext.PostalCode);
 
        }

        function onShowCity() { //al presionar el boton oculta el boton de show y muestra el boton de hide
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        }

        function onHideCity() { //al presionar el boton oculta el boton de hide y muestra el boton de show
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        }

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: onInit,
            onValidate: myCheck,
            onClearFilter:onClearFilter,
            onFilter: onFilter,
            showPostalCode: showPostalCode,
            onShowCity: onShowCity,
            onHideCity: onHideCity
        });
    });
