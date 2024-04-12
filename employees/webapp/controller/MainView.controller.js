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

        function onCloseOrders() { 
            this._oDialogOrders.close();
        }

        function showOrders(oEvent) {

            // Get selected Controller
            var iconPressed = oEvent.getSource();

            // Context from the model
            var oContext = iconPressed.getBindingContext("jsonEmployees");

            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employees.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            }

            // Dialog binding to the Context to have access to the data of selected  item
            this._oDialogOrders.bindElement("jsonEmployees>"+oContext.getPath());
            this._oDialogOrders.open();


            // var ordersTable = this.getView().byId("ordersTable");        
            
            // ordersTable.destroyItems();

            // var itemPressed = oEvent.getSource();
            // var oContext = itemPressed.getBindingContext("jsonEmployees");

            // var objectContext = oContext.getObject();
            // var orders = objectContext.Orders;

            // var ordersItems = [];

            // for (var i in orders) {
            //     ordersItems.push(new sap.m.ColumnListItem({
            //         cells:[
            //             new sap.m.Label({text: orders[i].OrderID}),
            //             new sap.m.Label({text: orders[i].Freight}),
            //             new sap.m.Label({text: orders[i].ShipAddress})
            //         ]
            //     }));
            // }

            // var newTable = new sap.m.Table({
            //     width: "auto",
            //     columns: [
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
            //         new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
            //     ],
            //     items: ordersItems
            // }).addStyleClass("sapUiSmallMargin");

            // ordersTable.addItem(newTable);
            

            // var newTableJSON = new sap.m.Table();
            // newTableJSON.setWidth("auto");
            // newTableJSON.addStyleClass("sapUiSmallMargin");

            // var columnOrderID = new sap.m.Column();
            // var labelOrderID = new sap.m.Label();
            // labelOrderID.bindProperty("text", "i18n>orderID")
            // columnOrderID.setHeader(labelOrderID);
            // newTableJSON.addColumn(columnOrderID);

            // var columnFreight = new sap.m.Column();
            // var labelFreight = new sap.m.Label();
            // labelFreight.bindProperty("text", "i18n>freight")
            // columnFreight.setHeader(labelFreight);
            // newTableJSON.addColumn(columnFreight);

            // var columnShipAddress = new sap.m.Column();
            // var labelShipAddress = new sap.m.Label();
            // labelShipAddress.bindProperty("text", "i18n>shipAddress")
            // columnShipAddress.setHeader(labelShipAddress);
            // newTableJSON.addColumn(columnShipAddress);

            // var columnListItem = new sap.m.ColumnListItem();

            // var cellOrderID = new sap.m.Label();
            // cellOrderID.bindProperty("text", "jsonEmployees>OrderID")
            // columnListItem.addCell(cellOrderID);

            // var cellFreight = new sap.m.Label();
            // cellFreight.bindProperty("text", "jsonEmployees>Freight")
            // columnListItem.addCell(cellFreight);

            // var cellShipAddress = new sap.m.Label();
            // cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress")
            // columnListItem.addCell(cellShipAddress);

            // var oBindingInfo = {
            //     model: "jsonEmployees",
            //     path: "Orders",
            //     template: columnListItem
            // };

            // newTableJSON.bindAggregation("items", oBindingInfo);
            // newTableJSON.bindElement("jsonEmployees>" + oContext.getPath()); //Con esto sabemos la posicion del item a mostrar
        
            // ordersTable.addItem(newTableJSON);


            

        }   

        

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: onInit,
            onValidate: myCheck,
            onClearFilter:onClearFilter,
            onFilter: onFilter,
            showPostalCode: showPostalCode,
            onShowCity: onShowCity,
            onHideCity: onHideCity,
            onCloseOrders: onCloseOrders,
            showOrders: showOrders
            
        });
    });
