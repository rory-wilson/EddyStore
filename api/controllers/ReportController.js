var fs = require('fs');
var exec = require('child_process').exec;

/**
 * ReportController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  eddypro: function (req, res) {
    if (!req.param('id')) {
      return res.badRequest('ID Missing');
    }
    console.log("hello world: " + req.param('id'));

    Report.findOne(req.param('id'))
      .populate('StatisticalAnalysis')
      .populate('SpectralCorrection')
      .populate('ProcessingOption')
      .populate('Flags')
      .populate('Variables')
      .exec(function (err, thisReport) {
        if (err) return err;
        if (!thisReport) return res.notFound();

        console.log("Found report " + thisReport.id);

        Data.findOne(thisReport.Data)
          .populate('Instruments')
          .populate('Columns')
          .exec(function (err, thisData) {
            if (err) return err;
            if (!thisData) return res.notFound();

            return res.send(EddyPro.getReport(thisReport, thisData.Folder_Path, ""));
          });
      });
  },

  request: function (req, res) {
    if (!req.param('id')) {
      return res.badRequest('ID Missing');
    }
    Report.findOne(req.param('id'))
      .populate('StatisticalAnalysis')
      .populate('SpectralCorrection')
      .populate('ProcessingOption')
      .populate('Output')
      .populate('Flags')
      .populate('Variables')
      .exec(function (err, thisReport) {
      if (err) return err;
      if (!thisReport) return res.notFound();

      console.log("Found report " + thisReport.id);

        thisReport.Status = "Requested";
        thisReport.save();

      Data.findOne(thisReport.Data)
      .populate('Instruments')
      .populate('Columns')
      .exec(function (err, thisData) {
          if (err) return err;
          if (!thisData) return res.notFound();

          var metadata = EddyPro.getMetadata(thisData);
          var report = EddyPro.getReport(thisReport, thisData.Folder_Path, "");

          var filename = sails.config.eddyProConfig.directory + thisReport.id;

          console.log("Saving files to " + filename);

          fs.writeFile(filename + ".metadata", metadata, function (err) {
            if (err) {
              res.json({'error': 'Failed to write ' + filename + '.metadata'});
            }
          });

          fs.writeFile(filename + ".eddypro", report, function (err) {
            if (err) {
              res.json({'error': 'Failed to write ' + filename + '.eddypro'});
            }
          });

          var cmd = sails.config.eddyProConfig.cmdPath + "-e " + thisData.Folder_Path + " " + filename + ".eddypro";
          console.log("Executing " + cmd);

          exec(cmd, function(error, stdout, stderr) {
           console.log(stdout);
          });

          return res.ok();
      });
    });
  }
};

