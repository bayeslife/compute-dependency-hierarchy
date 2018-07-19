
function combiner(n,f1,f2){
  var invoked = false
  return function(){
    //console.log("Combiner:"+n.id)
    if(invoked){
      n.layerdepth=-1
      n.depthfunction=()=>n.layerdepth;
      //console.log("Recursion:"+n.id+":"+n.layerdepth)
      return n.layerdepth;
    } else {
      invoked=true;
       var x1 = f1();
       var x2 = f2();
       n.layerdepth= x1>x2 ? x1 : x2
       n.depthfunction=()=>n.layerdepth
       //console.log("NoRecursion:"+n.id+":"+n.layerdepth)
       return n.layerdepth;
     }
  }
}


function computeDependencyHierarchy(layername,nodes=[],relations=[]){
  var result = []
  var nodeIndex = {}
  nodes.forEach((n)=>nodeIndex[n.id]=n)
  nodes.forEach(function(n){
    n.depthfunction=function(){
        if(n.layerdepth)
          return n.layerdepth
        else{
          n.layerdepth=0;
          return n.layerdepth
        }
    }
  })
  var dependencies=[];
  relations.forEach(function(r){
    var t = nodeIndex[r.target];
    var s = nodeIndex[r.source];
    if(t && s){
      t.depthfunction = combiner(t,t.depthfunction, function(){return s.depthfunction()+1})
    }
  })
  nodes.forEach(function(n){
    //console.log("----------"+n.id)
    n.depthfunction()
  })
  var layerindex= {}
  nodes.forEach(function(n){
      layerindex[n.layerdepth]={ id: layername+n.layerdepth, layerdepth: n.layerdepth,parent: null}
    n.parent = layername+n.layerdepth;
  })

  var layers = []
  Object.keys(layerindex).forEach(function(key){
    var layernodes=[]
    layers.push(layernodes)
    var layerroot = layerindex[key]
    layernodes.push(layerroot)
    nodes.forEach(function(n){
      delete n.depthfunction
      if(n.layerdepth==layerroot.layerdepth){
        layernodes.push(n)
      }
    })
  })
  return layers;
}

// function computeDependencyHierarchy2(node){
//   var id = node.data.id;
//   var result = {nodes: {},links: {}}
//   result.nodes[node.id]=true
//   var linkids = {}
//   function crn(id){
//     var rel = mapping.filter(function(linkdata){
//       var linkid = linkdata.source+linkdata.target;
//       if(linkids[linkid]){
//         return false;
//       }else if(linkdata.type==='Dependency'){
//         return linkdata.source===id
//       } else if(linkdata.type==='Realisation') {
//         return linkdata.target===id
//       }
//     })
//     if(rel.length>0){
//       rel.forEach(function(link){
//         if(link.source===id){
//           result.nodes[link.target]=true;
//         }else {
//           result.nodes[link.source]=true;
//         }
//         var ld = ilinkindex[link.source+link.target]
//         result.links[ld.index]=true
//         linkids[link.source+link.target]=true
//         crn(link.target)
//       })
//     }
//     return rel;
//   };
//   crn(id);
//   return result;
// }


module.exports=computeDependencyHierarchy
