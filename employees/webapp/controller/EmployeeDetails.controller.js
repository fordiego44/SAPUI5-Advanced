sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "logaligroup/employees/model/formatter"
    ],
    function(Controller, formatter) {
      "use strict";
      
      function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
      } 

      function onCreateIncidence() {
        var tableIncidence = this.getView().byId("tableIncidence"); 
        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this); 
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata =  incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
      }

      // function onDeleteIncidence(oEvent) {
      //   var tableIncidence = this.getView().byId("tableIncidence"); 
      //   var rowIncidence = oEvent.getSource().getParent().getParent();
      //   var incidenceModel = this.getView().getModel("incidenceModel"); 
      //   var odata =  incidenceModel.getData();
      //   var contextObj = rowIncidence.getBindingContext("incidenceModel");
        
      //   odata.splice(contextObj.index - 1, 1);
      //   for( var i in odata){
      //     odata[i].index = parseInt(i) + 1; 
      //   }
        
      //   incidenceModel.refresh();
      //   tableIncidence.removeContent(rowIncidence);

      //   for (var j in tableIncidence.getContent() ) {
      //     tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
      //   }
        
      // }

      
      function onDeleteIncidence(oEvent){
        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject(); 
        this._bus.publish("incidence", "onDeleteIncidence", { 
          IncidenceId: contextObj.IncidenceId, 
          SapId: contextObj.SapId, 
          EmployeeId: contextObj.EmployeeId
        
        });  
      }

      function onSaveIncidence(oEvent){
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
         var temp = incidenceRow.sPath.replace('/', '');
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });  
      }

      function updateIncidenceCreationDate(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.CreationDateX = true;
      }

      function updateIncidenceReason(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.ReasonX = true;
      }

      function updateIncidenceType(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.TypeX = true;
      }

      var EmployeeDetails = Controller.extend("logaligroup.employees.controller.EmployeeDetails", { });

      EmployeeDetails.prototype.onInit = onInit;
      EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
      EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
      EmployeeDetails.prototype.Formatter = formatter;
      EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
      EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
      EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
      EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;

      return EmployeeDetails;
    }
  );
  