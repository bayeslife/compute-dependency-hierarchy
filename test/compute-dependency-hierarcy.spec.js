var assert = require('assert')
var debug=require('debug')('TEST')
var cph = require('../index.js');

var nodes= [
    {
      id: "A"
    },
    {
      id: "B"
    },
]

var relationships = [
  {
    "source": "A",
    "target": "B",
  }
]

var layername = "layer";

describe('Component Dependency Hierarchy', function() {
    it('should produce 2 separate layers for A depends upon B', function() {
      var layers = cph(layername,nodes,relationships)
      debug(layers)
      assert.equal(layers.length,2)
      assert.equal(layers[0].filter((n)=>n.id==layername+0).length,1)
      assert.equal(layers[1].filter((n)=>n.id==layername+1).length,1)
      assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='A').length,1)
      assert.equal(layers[1].filter((n)=>n.layerdepth==1 && n.id=='B').length,1)
      assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.parent==layername+0).length,1)
      assert.equal(layers[1].filter((n)=>n.layerdepth==1 && n.parent==layername+1).length,1)
    });
});


var nodes2= [
    {
      id: "A"
    },
    {
      id: "B"
    },
    {
      id: "C"
    },
]

var relationships2 = [
  {
    "source": "A",
    "target": "B",
  },
  {
    "source": "B",
    "target": "C",
  }
]


describe('Component Dependency Hierarchy', function() {
    it('should produce 3 layers for A depends upon B depends upon C', function() {
      var layers = cph(layername,nodes2,relationships2)
      debug(JSON.stringify(layers));
      assert.equal(layers.length,3)
      assert.equal(layers[0].filter((n)=>n.id==layername+0).length,1)
      assert.equal(layers[1].filter((n)=>n.id==layername+1).length,1)
      assert.equal(layers[2].filter((n)=>n.id==layername+2).length,1)
      assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='A').length,1)
      assert.equal(layers[1].filter((n)=>n.layerdepth==1 && n.id=='B').length,1)
      assert.equal(layers[2].filter((n)=>n.layerdepth==2 && n.id=='C').length,1)
    });
});


var nodes3= [
    {
      id: "A"
    },
    {
      id: "B"
    },
    {
      id: "C"
    },
]

var relationships3 = [
  {
    "source": "A",
    "target": "B",
  },
  {
    "source": "C",
    "target": "A",
  }
]


describe('Component Dependency Hierarchy', function() {
    it('should produce 3 layers for A depends upon B and C depends upon A', function() {
      var layers = cph(layername,nodes3,relationships3)
      debug(JSON.stringify(layers));
      assert.equal(layers.length,3)
      assert.equal(layers[0].filter((n)=>n.id==layername+0).length,1)
      assert.equal(layers[1].filter((n)=>n.id==layername+1).length,1)
      assert.equal(layers[2].filter((n)=>n.id==layername+2).length,1)
      assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='C').length,1)
      assert.equal(layers[1].filter((n)=>n.layerdepth==1 && n.id=='A').length,1)
      assert.equal(layers[2].filter((n)=>n.layerdepth==2 && n.id=='B').length,1)
    });
});


var nodes4= [
    {
      id: "A"
    },
    {
      id: "B"
    },
    {
      id: "C"
    },
]


var relationships4 = [

  {
    "source": "A",
    "target": "B",
  },
  {
    "source": "C",
    "target": "A",
  },
  {
    "source": "B",
    "target": "C",
  }
]

describe('Component Dependency Hierarchy', function() {
    it('should handle a graph of n odes as a any n depth structure ', function() {
      var layers = cph(layername,nodes4,relationships4)
      debug(JSON.stringify(layers));
      assert.equal(layers.length,3)
      assert.equal(layers[0].filter((n)=>n.id==layername+0).length,1)
      assert.equal(layers[1].filter((n)=>n.id==layername+1).length,1)
      assert.equal(layers[2].filter((n)=>n.id==layername+2).length,1)
      assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='B').length,1)
      assert.equal(layers[1].filter((n)=>n.layerdepth==1 && n.id=='C').length,1)
      assert.equal(layers[2].filter((n)=>n.layerdepth==2 && n.id=='A').length,1)
    });
});


var nodes5= [
    {
      id: "Z"
    },
    {
      id: "A"
    }
]


var relationships5 = [
]

describe('Component Dependency Hierarchy', function() {
    it('should layout nodes in depth 0 when no involved relationships', function() {
      var layers = cph(layername,nodes5,relationships5)
      debug(JSON.stringify(layers));
      assert.equal(layers.length,1)
      assert.equal(layers[0].filter((n)=>n.id==layername+0).length,1)
      assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='A').length,1)
      assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='Z').length,1)
    });
});

var nodes6= [
  {
    id: "A"
  },
  {
    id: "B"
  }
]


var relationships6 = [
  {
    "source": "Y",
    "target": "Z",
  },
]

describe('Component Dependency Hierarchy', function() {
  it('should ignore relationship unrelated to nodes', function() {
    var layers = cph(layername,nodes6,relationships6)
    debug(JSON.stringify(layers));
    assert.equal(layers[0].filter((n)=>n.id==layername+0).length,1)
    assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='A').length,1)
    assert.equal(layers[0].filter((n)=>n.layerdepth==0 && n.id=='B').length,1)
  });
});
