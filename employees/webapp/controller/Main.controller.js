sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("logaligroup.employees.controller.Main", {
        onInit: function() { // carga dos modelos, uno con propiedades y otro retorna y lista directamente

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

          var oJSONModelLayout = new sap.ui.model.json.JSONModel();
          oJSONModelLayout.loadData("./localService/mockData/Layout.json", false); //carga de datos, y false para que espere a cargar todos los datos
          oView.setModel(oJSONModelLayout, "jsonLayout");

          var oJSONModelConfig = new sap.ui.model.json.JSONModel({
              visibleID: true,
              visibleName: true,
              visibleCountry: true,
              visibleCity: false,
              visibleBtnShowCity: true,
              visibleBtnHideCity: false
              
          });

          oView.setModel(oJSONModelConfig, "jsonModelConfig");

          this._bus = sap.ui.getCore().getEventBus(); 
          this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
        },
        showEmployeeDetails: function (category, nameEvent, path) {
          var detailView = this.getView().byId("detailEmployeeView");
          detailView.bindElement("jsonEmployees>"+ path);
          this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
        }
      });
    }
  );
  