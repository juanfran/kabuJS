describe('kabuJS', function() {
  var createDOMElm = function (views) {
    var div = document.createElement("DIV");

    div.setAttribute('view', views);

    return div;
  };

  it("declare module", function() {
    var fnSpy = function(){};
    var moduleName = 'module1';
    var dependencies = ['dep1', 'dep2'];
    var mockInjector = sinon.mock(Injector);

    mockInjector.expects('add').withArgs(moduleName, fnSpy);

    kabu.module(moduleName, dependencies, fnSpy);

    expect(fnSpy._inject).to.be.eql(dependencies);
    mockInjector.verify();

    mockInjector.restore();
  });

  it("service and view should be modules", function () {
    expect(kabu.service).to.be.eql(kabu.module);
    expect(kabu.view).to.be.eql(kabu.module);
  });

  describe('compile views', function () {
    it("invoke finded views", function () {
      var dom1 = createDOMElm('view1');
      var dom2 = createDOMElm('view2');
      var dom3 = createDOMElm('view3, view4');

      var fnSpy1 = function () {};
      var fnSpy2 = function () {};
      var fnSpy3 = function () {};
      var fnSpy4 = function () {};

      var injectElm = sinon.match(function (value) {
        return !!value.el;
      }, "inject elm");

      var getViewsStub = sinon.stub(kabu, "getViews");
      getViewsStub.returns([dom1, dom2, dom3]);

      var injectorGetStub = sinon.stub(Injector, 'get');
      injectorGetStub.withArgs('view1').returns(fnSpy1);
      injectorGetStub.withArgs('view2').returns(fnSpy2);
      injectorGetStub.withArgs('view3').returns(fnSpy3);
      injectorGetStub.withArgs('view4').returns(fnSpy4);

      var mockInjector = sinon.mock(Injector);
      mockInjector.expects('invoke').withArgs(fnSpy1, injectElm);
      mockInjector.expects('invoke').withArgs(fnSpy2, injectElm);
      mockInjector.expects('invoke').withArgs(fnSpy3, injectElm);
      mockInjector.expects('invoke').withArgs(fnSpy4, injectElm);

      kabu.compile();

      mockInjector.verify();

      getViewsStub.restore();
      injectorGetStub.restore();
      mockInjector.restore();
    });

    it("throw if the view does't exist", function () {
      var dom1 = createDOMElm('view1');

      var getViewsStub = sinon.stub(kabu, "getViews");
      getViewsStub.returns([dom1]);

      var injectorGetStub = sinon.stub(Injector, 'get');
      injectorGetStub.withArgs('view1').returns(false);

      expect(kabu.compile).to.throw(Error, /view1 does not exist/);

      getViewsStub.restore();
      injectorGetStub.restore();
    });
  });

  it("exec", function () {
    var fnSpy = function(){};
    var moduleName = 'module1';

    var injectorGetStub = sinon.stub(Injector, 'get');
    injectorGetStub.withArgs(moduleName).returns(fnSpy);

    var mockInjector = sinon.mock(Injector);
    mockInjector.expects('invoke').withArgs(fnSpy);

    kabu.exec(moduleName);
    mockInjector.verify();

    mockInjector.restore();
    injectorGetStub.restore();
  });

  describe("configure", function () {
    it("execute configuration", function () {
      var fnSpy1 = sinon.spy();
      var fnSpy2 = sinon.spy();
      var fnSpy3 = sinon.spy();

      kabu.configure.fns = [fnSpy1, fnSpy2, fnSpy3];

      kabu.configure.exec();

      expect(fnSpy1.called).to.be.true;
      expect(fnSpy2.called).to.be.true;
      expect(fnSpy3.called).to.be.true;

       kabu.configure.fns = [];
    });

    it("add configuration", function () {
      var fnSpy1 = function() {};
      var fnSpy2 = function() {};

      var fns = [fnSpy1, fnSpy2];

      kabu.configure.addConfiguration(fnSpy1);
      kabu.configure.addConfiguration(fnSpy2);

      expect(kabu.configure.fns).to.be.eql(fns);

      kabu.configure.fns = [];
    });
  });

  describe("load", function () {
    it("execute on load", function () {
      var fnSpy1 = sinon.spy();
      var fnSpy2 = sinon.spy();
      var fnSpy3 = sinon.spy();

      kabu.load.fns = [fnSpy1, fnSpy2, fnSpy3];

      kabu.load.exec();

      expect(fnSpy1.called).to.be.true;
      expect(fnSpy2.called).to.be.true;
      expect(fnSpy3.called).to.be.true;

       kabu.load.fns = [];
    });

    it("add on load fns", function () {
      var fnSpy1 = function() {};
      var fnSpy2 = function() {};

      var fns = [fnSpy1, fnSpy2];

      kabu.load.onLoad(fnSpy1);
      kabu.load.onLoad(fnSpy2);

      expect(kabu.load.fns).to.be.eql(fns);

      kabu.load.fns = [];
    });
  });

  it("init kabu", function () {
    var stubConfigure = sinon.stub(kabu.configure, 'exec');
    var stubCompile = sinon.stub(kabu, 'compile');
    var stubLoad = sinon.stub(kabu.load, 'exec');

    kabu.init();

    sinon.assert.callOrder(stubConfigure, stubCompile, stubLoad);

    stubConfigure.restore();
    stubCompile.restore();
    stubLoad.restore();
  });
});
