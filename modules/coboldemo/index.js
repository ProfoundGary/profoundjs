// Program Id: INQ01L.
// Author: Ted Holt.
// Date Written: August 2018.
// This is a direct translation of RPG program INQ01R.

// This is the original green-screen version & can run
// from a green-screen or Genie session.

function inq01l() {
    pjs.defineDisplay("displayFile", "inq01d.json", { userOpen: true, flagDS: 'indicatorStructure', rrnFields: { prodsfl: 'subfileRecordNumber', featsfl: 'subfileRecordNumber' }, prefix: 'ignore_' });
    pjs.define("prodctlInput", { type: 'data structure', hybrid: true, overlay: 'displayRecord', extName: { file: 'inq01d.json', format: 'prodctl', extract: '*input' }, prefix: 'ignore_' });
    pjs.define("prodctlOutput", { type: 'data structure', hybrid: true, overlay: 'displayRecord', extName: { file: 'inq01d.json', format: 'prodctl', extract: '*output' }, prefix: 'ignore_' });
    pjs.define("prodsfl", { type: 'data structure', hybrid: true, overlay: 'displayRecord', extName: { file: 'inq01d.json', format: 'prodsfl' }, prefix: 'ignore_' });
  
    pjs.defineTable("productsFile", "productsp", { userOpen: true, keyed: true, ds: 'productsRecord', read: true });
  
    pjs.defineTable("productsById", "products1l", { userOpen: true, keyed: true, ds: 'productsRecord1', read: true });
  
    pjs.defineTable("productsByName", "products2l", { userOpen: true, keyed: true, ds: 'productsRecord2', read: true });
  
    pjs.defineTable("categoryFile", "categp", { userOpen: true, keyed: true, ds: 'categoryRecord', read: true });
  
    pjs.defineTable("productFeatures", "prodfeatp", { userOpen: true, keyed: true, ds: 'productFeaturesRecord', read: true });
  
    pjs.defineTable("featuresFile", "featuresp", { userOpen: true, keyed: true, ds: 'featuresRecord', read: true });
  
    pjs.define("prodsflRecord", {
      type: 'data structure',
      hybrid: true,
      elements: { prodsfl: { type: 'data structure', hybrid: true, extName: { file: 'inq01d.json', format: 'prodsfl' } } }
    });
    pjs.define("prodctlRecordIn", {
      type: 'data structure',
      hybrid: true,
      elements: { prodctlInput: { type: 'data structure', hybrid: true, extName: { file: 'inq01d.json', format: 'prodctl', extract: '*input' } } }
    });
    pjs.define("prodctlRecordOut", {
      type: 'data structure',
      hybrid: true,
      elements: { prodctlOutput: { type: 'data structure', hybrid: true, extName: { file: 'inq01d.json', format: 'prodctl', extract: '*output' } } }
    });
    pjs.define("proddetlRecordOut", {
      type: 'data structure',
      hybrid: true,
      elements: { proddetlOutput: { type: 'data structure', hybrid: true, extName: { file: 'inq01d.json', format: 'proddetl', extract: '*output' } } }
    });
    pjs.define("featsflRecord", {
      type: 'data structure',
      hybrid: true,
      elements: { featsfl: { type: 'data structure', hybrid: true, extName: { file: 'inq01d.json', format: 'featsfl' } } }
    });
  
    pjs.define("wsProductsRecord", { type: 'data structure', hybrid: true, extName: 'productsp', prefix: 'ws_prod_' });
  
    pjs.define("currentProductId", { like: 'prid' });
  
    pjs.define("_flags", { type: "data structure", elements: {
      "endOfReadFlag": { type: 'boolean' },
      "sflChangeFlag": { type: 'boolean' }
    }});
  
    pjs.define("subfileRecordNumber", { type: 'numeric', length: 4, decimals: 0 });
  
    pjs.define("indicatorStructure", { type: "data structure", elements: {
      "displayIndicator": { type: 'boolean', dim: 99, from: 1 }
    }});
    pjs.define("*unnamed", { type: "data structure", redefines: 'indicatorStructure', elements: {
      "*unnamed": { type: 'char', length: 2 },
      "exitFlag": { type: 'boolean' }
    }});
  
    const sections = {
      "main": {
        "000-main-logic": () => {
          productsFile.open();
          productsById.open();
          productsByName.open();
          categoryFile.open();
          productFeatures.open();
          featuresFile.open();
          displayFile.open();
  
          pjs.clear(prodsflRecord);
          pjs.clear(prodctlRecordIn);
          pjs.clear(prodctlRecordOut);
          pjs.clear(proddetlRecordOut);
          pjs.clear(featsflRecord);
  
          controller.execute("010-get-first-category");
          while (!(exitFlag)) { // exit requested
            controller.execute("020-load-subfile");
            controller.execute("040-display-subfile");
            if (! exitFlag) {
              displayFile.prodsfl.readChanged(pjs.ds("prodsflRecord"));
              if (displayFile.endOfData()) {
                sflChangeFlag = true; // no-change-to-sfl
              }
              if (!displayFile.endOfData()) {
                currentProductId = prodsflRecord.prid;
                sflChangeFlag = false; // changed-sfl-record
              }
              if (!sflChangeFlag && prodsflRecord.opt == "1") {
                controller.execute("050-show-product-details");
              }
            }
          }
          productsFile.close();
          productsById.close();
          productsByName.close();
          categoryFile.close();
          displayFile.close();
          productFeatures.close();
          featuresFile.close();
          controller.stop(false);
          return;
  
        },
        "010-get-first-category": () => {
          categoryFile.positionTo(pjs.START);
          categoryFile.fetchNext();
          if (categoryFile.endOfData()) {
            pjs.clear(categoryRecord);
          }
          prodctlOutput.s1catid = categoryRecord.categ.catid;
          prodctlOutput.catname = categoryRecord.categ.catname;
  
        },
        "020-load-subfile": () => {
  
          // clear the subfile
          displayIndicator[70] = true;
          displayFile.prodctl.write(pjs.ds("prodctlRecordOut"));
          displayIndicator[70] = false;
          subfileRecordNumber = 0;
  
          if (prodctlRecordOut.s1prname == '') {
            // ****   start PRODUCTS1
            productsRecord1.products.prcatid = prodctlRecordOut.s1catid;
            productsRecord1.products.prid = prodctlRecordOut.s1prid;
            productsById.positionTo([productsRecord1.products.prcatid, productsRecord1.products.prid]);
          }
          else {
            // *****  start PRODUCTS2
            productsRecord2.products.prcatid = prodctlRecordOut.s1catid;
            productsRecord2.products.prname = prodctlRecordOut.s1prname;
            productsRecord2.products.prid = prodctlRecordOut.s1prid;
            productsByName.positionTo([productsRecord2.products.prcatid, productsRecord2.products.prname, productsRecord2.products.prid]);
          }
  
          endOfReadFlag = false; // more-data
          controller.execute("030-read-product");
          while (!(endOfReadFlag)) { // no more data
            pjs.clear(prodsflRecord.prodsfl);
            prodsflRecord.prid = ws_prod_prid;
            prodsflRecord.prname = ws_prod_prname;
            prodsflRecord.prprice = ws_prod_prprice;
            prodsflRecord.prqty = ws_prod_prqty;
            pjs.assign(subfileRecordNumber, subfileRecordNumber + 1);
            displayFile.prodsfl.write(pjs.ds("prodsflRecord"));
            controller.execute("030-read-product");
          }
  
        },
        "030-read-product": () => {
          if (prodctlRecordOut.s1prname == '') {
            productsById.fetchNext(false, null, pjs.ds("wsProductsRecord"));
            if (productsById.endOfData()) {
              endOfReadFlag = true; // no-more-data
            }
          }
          else {
            productsByName.fetchNext(false, null, pjs.ds("wsProductsRecord"));
            if (productsByName.endOfData()) {
              endOfReadFlag = true; // no-more-data
            }
          }
  
        },
        "040-display-subfile": () => {
          displayFile.prodbottom.write();
          displayFile.prodctl.write(pjs.ds("prodctlRecordOut"));
          displayFile.prodctl.read(pjs.ds("prodctlRecordIn"));
          pjs.assignCorresponding(prodctlRecordOut.prodctlOutput, prodctlRecordIn.prodctlInput);
  
        },
        "050-show-product-details": () => {
          productsRecord.products.prid = currentProductId;
          productsFile.getRecord(productsRecord.products.prid, false, null, pjs.ds("wsProductsRecord"));
          if (!productsFile.found()) {
            pjs.clear(wsProductsRecord);
          }
  
          proddetlRecordOut.prid = ws_prod_prid;
          proddetlRecordOut.prname = ws_prod_prname;
          proddetlRecordOut.prdesc = ws_prod_prdesc;
          proddetlRecordOut.prprice = ws_prod_prprice;
          proddetlRecordOut.prqty = ws_prod_prqty;
          proddetlRecordOut.prcatid = ws_prod_prcatid;
  
          categoryRecord.categ.catid = ws_prod_prcatid;
          categoryFile.getRecord(categoryRecord.categ.catid);
          if (!categoryFile.found()) {
            proddetlRecordOut.catname = '';
          }
          if (categoryFile.found()) {
            proddetlRecordOut.catname = categoryRecord.categ.catname;
          }
  
          while (!(displayIndicator[6] == false)) {
            displayFile.proddetl.write(pjs.ds("proddetlRecordOut"));
            displayFile.proddetl.read();
            if (displayIndicator[6] == true) {
              controller.execute("060-show-features");
            }
          }
  
        },
        "060-show-features": () => {
  
          // clear the subfile
          displayIndicator[60] = true;
          displayFile.featwin.write();
          displayIndicator[60] = false;
          subfileRecordNumber = 0;
  
          // load the subfile
          productFeaturesRecord.prodfeat.xprid = currentProductId;
          productFeaturesRecord.prodfeat.xfeid = 0;
          productFeatures.positionTo([productFeaturesRecord.prodfeat.xprid, productFeaturesRecord.prodfeat.xfeid]);
  
          endOfReadFlag = false; // more-data
          controller.execute("070-read-product-feature");
          while (!(endOfReadFlag)) { // no more data
            featsflRecord.feid = productFeaturesRecord.prodfeat.xfeid;
  
            featuresRecord.features.feid = productFeaturesRecord.prodfeat.xfeid;
            featuresFile.getRecord(featuresRecord.features.feid);
            if (!featuresFile.found()) {
              featsflRecord.fename = '';
            }
            if (featuresFile.found()) {
              featsflRecord.fename = featuresRecord.features.fename;
            }
  
            pjs.assign(subfileRecordNumber, subfileRecordNumber + 1);
            displayFile.featsfl.write(pjs.ds("featsflRecord"));
            controller.execute("070-read-product-feature");
          }
  
          displayFile.featwin.write();
          displayFile.featwin.read();
  
        },
        "070-read-product-feature": () => {
          productFeatures.fetchNext();
          if (productFeatures.endOfData()) {
            endOfReadFlag = true; // no-more-data
          }
          if (!endOfReadFlag && xprid !== currentProductId) {
            endOfReadFlag = true; // no-more-data
          }
        }
      }
    }
  
    const controller = new pjs.Controller(sections);
    controller.start();
  }
  
  exports.default = inq01l;
  
