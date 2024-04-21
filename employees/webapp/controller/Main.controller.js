sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("logaligroup.employees.controller.Main", {
        onBeforeRendering: function () {
          this._detailEmployeeView = this.getView().byId("detailEmployeeView");
        },
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
          detailView.bindElement("odataNorthwind>"+ path);
          this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

          var incidenceModel = new sap.ui.model.json.JSONModel([]);
          detailView.setModel(incidenceModel, "incidenceModel");
          detailView.byId("tableIncidence").removeAllContent();
        },

        onSaveODataIncidence: function (channelId, eventId, data) {
          var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
          var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
          var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

          if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {

            var body = {
              SapId: this.getOwnerComponent().SapId,
              EmployeeId: employeeId.toString(),
              CreationDate: incidenceModel[data.incidenceRow].CreationDate,
              Type: incidenceModel[data.incidenceRow].Type,
              Reason: incidenceModel[data.incidenceRow].Reason
            };
            
            this.getView().getView().getModel("incidenceModel").create("/IncidentsSet", body, {
              success: function () {
                sap.m.MessageToast.show( oResourceBundle.getText("odataSaveOK") );
              }.bind(this),
              error: function (e) {
                sap.m.MessageToast.show( oResourceBundle.getText("odataSaveKO") );
              }.bind(this)
            });

          } else {
            sap.m.MessageToast.show( oResourceBundle.getText("odataNoChanges") );
          }
        }
      });
    }
  );
  