(function() {
  function Model() {
    THREE.Geometry.call(this);
    var self = this;
    
    function each(arr, fn) {
      for(var i = 0, l = arr.length; i < l; i++) {
        fn(arr[i], i);
      }
    }
    
    // Points
    this.vertices = [new THREE.Vector3(-5.708661,-5.708661,2.755906),new THREE.Vector3(-2.165354,-5.708661,0.000000),new THREE.Vector3(-5.708661,-5.708661,0.000000),new THREE.Vector3(-2.165354,-5.708661,2.755906),new THREE.Vector3(-2.165354,-5.708661,0.000000),new THREE.Vector3(-5.708661,1.377953,0.000000),new THREE.Vector3(-5.708661,-5.708661,0.000000),new THREE.Vector3(-4.133858,1.377953,0.000000),new THREE.Vector3(-2.165354,1.377953,0.000000),new THREE.Vector3(-2.165354,1.377953,9.842520),new THREE.Vector3(-4.133858,1.377953,0.000000),new THREE.Vector3(-2.165354,1.377953,0.000000),new THREE.Vector3(-5.708661,1.377953,0.000000),new THREE.Vector3(-5.708661,1.377953,9.842520),new THREE.Vector3(-2.165354,1.377953,9.842520),new THREE.Vector3(-2.165354,-1.377953,2.755906),new THREE.Vector3(-2.165354,-1.377953,9.842520),new THREE.Vector3(-2.165354,-5.708661,0.000000),new THREE.Vector3(-2.165354,-5.708661,2.755906),new THREE.Vector3(-2.165354,1.377953,0.000000),new THREE.Vector3(-5.708661,1.377953,0.000000),new THREE.Vector3(-5.708661,-5.708661,2.755906),new THREE.Vector3(-5.708661,-5.708661,0.000000),new THREE.Vector3(-5.708661,-1.377953,2.755906),new THREE.Vector3(-5.708661,-1.377953,9.842520),new THREE.Vector3(-5.708661,1.377953,9.842520),new THREE.Vector3(-5.708661,-1.377953,9.842520),new THREE.Vector3(-2.165354,-1.377953,2.755906),new THREE.Vector3(-5.708661,-1.377953,2.755906),new THREE.Vector3(-2.165354,-1.377953,9.842520),new THREE.Vector3(-2.165354,-1.377953,2.755906),new THREE.Vector3(-5.708661,-5.708661,2.755906),new THREE.Vector3(-5.708661,-1.377953,2.755906),new THREE.Vector3(-2.165354,-5.708661,2.755906),new THREE.Vector3(-2.165354,1.377953,9.842520),new THREE.Vector3(-5.708661,-1.377953,9.842520),new THREE.Vector3(-5.708661,1.377953,9.842520),new THREE.Vector3(-2.165354,-1.377953,9.842520),new THREE.Vector3(2.165354,-5.708661,2.755906),new THREE.Vector3(5.708661,-5.708661,0.000000),new THREE.Vector3(2.165354,-5.708661,0.000000),new THREE.Vector3(5.708661,-5.708661,2.755906),new THREE.Vector3(5.708661,-5.708661,0.000000),new THREE.Vector3(2.165354,1.377953,0.000000),new THREE.Vector3(2.165354,-5.708661,0.000000),new THREE.Vector3(3.740157,1.377953,0.000000),new THREE.Vector3(5.708661,1.377953,0.000000),new THREE.Vector3(5.708661,1.377953,9.842520),new THREE.Vector3(3.740157,1.377953,0.000000),new THREE.Vector3(5.708661,1.377953,0.000000),new THREE.Vector3(2.165354,1.377953,0.000000),new THREE.Vector3(2.165354,1.377953,9.842520),new THREE.Vector3(5.708661,1.377953,9.842520),new THREE.Vector3(5.708661,-1.377953,2.755906),new THREE.Vector3(5.708661,-1.377953,9.842520),new THREE.Vector3(5.708661,-5.708661,0.000000),new THREE.Vector3(5.708661,-5.708661,2.755906),new THREE.Vector3(5.708661,1.377953,0.000000),new THREE.Vector3(2.165354,1.377953,0.000000),new THREE.Vector3(2.165354,-5.708661,2.755906),new THREE.Vector3(2.165354,-5.708661,0.000000),new THREE.Vector3(2.165354,-1.377953,2.755906),new THREE.Vector3(2.165354,-1.377953,9.842520),new THREE.Vector3(2.165354,1.377953,9.842520),new THREE.Vector3(2.165354,-1.377953,9.842520),new THREE.Vector3(5.708661,-1.377953,2.755906),new THREE.Vector3(2.165354,-1.377953,2.755906),new THREE.Vector3(5.708661,-1.377953,9.842520),new THREE.Vector3(5.708661,-1.377953,2.755906),new THREE.Vector3(2.165354,-5.708661,2.755906),new THREE.Vector3(2.165354,-1.377953,2.755906),new THREE.Vector3(5.708661,-5.708661,2.755906),new THREE.Vector3(5.708661,1.377953,9.842520),new THREE.Vector3(2.165354,-1.377953,9.842520),new THREE.Vector3(2.165354,1.377953,9.842520),new THREE.Vector3(5.708661,-1.377953,9.842520),new THREE.Vector3(9.448819,1.033465,20.866142),new THREE.Vector3(6.496063,1.033465,12.007874),new THREE.Vector3(9.448819,1.033465,12.007874),new THREE.Vector3(6.496063,1.033465,20.866142),new THREE.Vector3(6.496063,1.033465,12.007874),new THREE.Vector3(6.496063,-2.362205,14.370079),new THREE.Vector3(6.496063,-2.362205,12.007874),new THREE.Vector3(6.496063,-1.230315,14.370079),new THREE.Vector3(6.496063,-1.230315,20.866142),new THREE.Vector3(6.496063,1.033465,20.866142),new THREE.Vector3(6.496063,-1.230315,20.866142),new THREE.Vector3(9.448819,-1.230315,14.370079),new THREE.Vector3(6.496063,-1.230315,14.370079),new THREE.Vector3(9.448819,-1.230315,20.866142),new THREE.Vector3(9.448819,1.033465,20.866142),new THREE.Vector3(9.448819,-1.230315,14.370079),new THREE.Vector3(9.448819,-1.230315,20.866142),new THREE.Vector3(9.448819,-6.938976,12.007874),new THREE.Vector3(9.448819,-6.938976,14.370079),new THREE.Vector3(9.448819,1.033465,12.007874),new THREE.Vector3(9.448819,1.033465,20.866142),new THREE.Vector3(6.496063,-1.230315,20.866142),new THREE.Vector3(6.496063,1.033465,20.866142),new THREE.Vector3(9.448819,-1.230315,20.866142),new THREE.Vector3(9.448819,-6.938976,12.007874),new THREE.Vector3(6.496063,-2.362205,12.007874),new THREE.Vector3(6.496063,-6.938976,12.007874),new THREE.Vector3(6.496063,1.033465,12.007874),new THREE.Vector3(9.448819,1.033465,12.007874),new THREE.Vector3(6.496063,-6.938976,14.370079),new THREE.Vector3(9.448819,-6.938976,12.007874),new THREE.Vector3(6.496063,-6.938976,12.007874),new THREE.Vector3(9.448819,-6.938976,14.370079),new THREE.Vector3(9.448819,-1.230315,14.370079),new THREE.Vector3(6.496063,-2.362205,14.370079),new THREE.Vector3(6.496063,-1.230315,14.370079),new THREE.Vector3(6.496063,-6.938976,14.370079),new THREE.Vector3(9.448819,-6.938976,14.370079),new THREE.Vector3(-6.889764,-6.938976,12.007874),new THREE.Vector3(-9.842520,1.033465,12.007874),new THREE.Vector3(-9.842520,-6.938976,12.007874),new THREE.Vector3(-6.889764,1.033465,12.007874),new THREE.Vector3(-6.889764,-2.362205,12.007874),new THREE.Vector3(-9.842520,1.033465,12.007874),new THREE.Vector3(-9.842520,-6.938976,14.370079),new THREE.Vector3(-9.842520,-6.938976,12.007874),new THREE.Vector3(-9.842520,-1.230315,14.370079),new THREE.Vector3(-9.842520,-1.230315,20.866142),new THREE.Vector3(-9.842520,1.033465,20.866142),new THREE.Vector3(-9.842520,-1.230315,20.866142),new THREE.Vector3(-6.889764,-1.230315,14.370079),new THREE.Vector3(-9.842520,-1.230315,14.370079),new THREE.Vector3(-6.889764,-1.230315,20.866142),new THREE.Vector3(-6.889764,1.033465,20.866142),new THREE.Vector3(-9.842520,1.033465,12.007874),new THREE.Vector3(-6.889764,1.033465,12.007874),new THREE.Vector3(-9.842520,1.033465,20.866142),new THREE.Vector3(-6.889764,-2.362205,14.370079),new THREE.Vector3(-6.889764,-6.938976,12.007874),new THREE.Vector3(-6.889764,-6.938976,14.370079),new THREE.Vector3(-6.889764,-2.362205,12.007874),new THREE.Vector3(-6.889764,1.033465,20.866142),new THREE.Vector3(-9.842520,-1.230315,20.866142),new THREE.Vector3(-9.842520,1.033465,20.866142),new THREE.Vector3(-6.889764,-1.230315,20.866142),new THREE.Vector3(-9.842520,-6.938976,14.370079),new THREE.Vector3(-6.889764,-6.938976,12.007874),new THREE.Vector3(-9.842520,-6.938976,12.007874),new THREE.Vector3(-6.889764,-6.938976,14.370079),new THREE.Vector3(-6.889764,-1.230315,14.370079),new THREE.Vector3(-9.842520,-6.938976,14.370079),new THREE.Vector3(-9.842520,-1.230315,14.370079),new THREE.Vector3(-6.889764,-6.938976,14.370079),new THREE.Vector3(-6.889764,-2.362205,14.370079),new THREE.Vector3(6.496063,-2.362205,20.866142),new THREE.Vector3(-6.889764,-1.230315,20.866142),new THREE.Vector3(-6.889764,-2.362205,20.866142),new THREE.Vector3(-1.328740,-1.230315,20.866142),new THREE.Vector3(-6.889764,1.033465,20.866142),new THREE.Vector3(0.935039,-1.230315,20.866142),new THREE.Vector3(0.935039,1.033465,20.866142),new THREE.Vector3(6.496063,2.165354,20.866142),new THREE.Vector3(-6.889764,2.165354,20.866142),new THREE.Vector3(-1.328740,1.033465,20.866142),new THREE.Vector3(6.496063,-1.230315,20.866142),new THREE.Vector3(6.496063,1.033465,20.866142),new THREE.Vector3(-6.889764,2.165354,20.866142),new THREE.Vector3(6.496063,2.165354,9.842520),new THREE.Vector3(-6.889764,2.165354,9.842520),new THREE.Vector3(6.496063,2.165354,20.866142),new THREE.Vector3(6.496063,-1.230315,14.370079),new THREE.Vector3(6.496063,-2.362205,20.866142),new THREE.Vector3(6.496063,-2.362205,14.370079),new THREE.Vector3(6.496063,-1.230315,20.866142),new THREE.Vector3(6.496063,-2.362205,12.007874),new THREE.Vector3(-6.889764,-2.362205,9.842520),new THREE.Vector3(6.496063,-2.362205,9.842520),new THREE.Vector3(-6.889764,-2.362205,12.007874),new THREE.Vector3(6.496063,-2.362205,14.370079),new THREE.Vector3(-6.889764,-2.362205,14.370079),new THREE.Vector3(6.496063,-2.362205,20.866142),new THREE.Vector3(-6.889764,-2.362205,20.866142),new THREE.Vector3(-6.889764,2.165354,20.866142),new THREE.Vector3(-6.889764,1.033465,12.007874),new THREE.Vector3(-6.889764,1.033465,20.866142),new THREE.Vector3(-6.889764,-2.362205,9.842520),new THREE.Vector3(-6.889764,-2.362205,12.007874),new THREE.Vector3(-6.889764,2.165354,9.842520),new THREE.Vector3(-6.889764,2.165354,9.842520),new THREE.Vector3(-5.708661,1.377953,9.842520),new THREE.Vector3(-6.889764,-2.362205,9.842520),new THREE.Vector3(6.496063,2.165354,9.842520),new THREE.Vector3(-2.165354,1.377953,9.842520),new THREE.Vector3(2.165354,1.377953,9.842520),new THREE.Vector3(-2.165354,-1.377953,9.842520),new THREE.Vector3(5.708661,1.377953,9.842520),new THREE.Vector3(5.708661,-1.377953,9.842520),new THREE.Vector3(-5.708661,-1.377953,9.842520),new THREE.Vector3(6.496063,-2.362205,9.842520),new THREE.Vector3(2.165354,-1.377953,9.842520),new THREE.Vector3(-6.889764,-1.230315,20.866142),new THREE.Vector3(-6.889764,-2.362205,14.370079),new THREE.Vector3(-6.889764,-2.362205,20.866142),new THREE.Vector3(-6.889764,-1.230315,14.370079),new THREE.Vector3(6.496063,2.165354,9.842520),new THREE.Vector3(6.496063,-2.362205,12.007874),new THREE.Vector3(6.496063,-2.362205,9.842520),new THREE.Vector3(6.496063,1.033465,12.007874),new THREE.Vector3(6.496063,1.033465,20.866142),new THREE.Vector3(6.496063,2.165354,20.866142),new THREE.Vector3(6.496063,-2.362205,12.007874),new THREE.Vector3(6.496063,-6.938976,14.370079),new THREE.Vector3(6.496063,-6.938976,12.007874),new THREE.Vector3(6.496063,-2.362205,14.370079),new THREE.Vector3(-6.889764,1.033465,20.866142),new THREE.Vector3(-6.889764,-1.230315,14.370079),new THREE.Vector3(-6.889764,-1.230315,20.866142),new THREE.Vector3(-6.889764,-2.362205,12.007874),new THREE.Vector3(-6.889764,-2.362205,14.370079),new THREE.Vector3(-6.889764,1.033465,12.007874),new THREE.Vector3(0.935039,1.033465,23.622047),new THREE.Vector3(0.935039,-1.230315,20.866142),new THREE.Vector3(0.935039,-1.230315,23.622047),new THREE.Vector3(0.935039,1.033465,20.866142),new THREE.Vector3(0.935039,-1.230315,23.622047),new THREE.Vector3(-1.328740,1.033465,23.622047),new THREE.Vector3(-1.328740,-1.230315,23.622047),new THREE.Vector3(0.935039,1.033465,23.622047),new THREE.Vector3(0.935039,1.033465,23.622047),new THREE.Vector3(-1.328740,1.033465,20.866142),new THREE.Vector3(0.935039,1.033465,20.866142),new THREE.Vector3(-1.328740,1.033465,23.622047),new THREE.Vector3(-1.328740,1.033465,20.866142),new THREE.Vector3(-1.328740,-1.230315,23.622047),new THREE.Vector3(-1.328740,-1.230315,20.866142),new THREE.Vector3(-1.328740,1.033465,23.622047),new THREE.Vector3(0.935039,-1.230315,20.866142),new THREE.Vector3(-1.328740,1.033465,20.866142),new THREE.Vector3(-1.328740,-1.230315,20.866142),new THREE.Vector3(0.935039,1.033465,20.866142),new THREE.Vector3(-1.328740,-1.230315,23.622047),new THREE.Vector3(0.935039,-1.230315,20.866142),new THREE.Vector3(-1.328740,-1.230315,20.866142),new THREE.Vector3(0.935039,-1.230315,23.622047),new THREE.Vector3(4.576772,2.706693,29.527559),new THREE.Vector3(-4.970472,-2.903543,29.527559),new THREE.Vector3(-4.970472,2.706693,29.527559),new THREE.Vector3(4.576772,-2.903543,29.527559),new THREE.Vector3(4.576772,2.706693,29.527559),new THREE.Vector3(4.576772,-2.903543,23.622047),new THREE.Vector3(4.576772,-2.903543,29.527559),new THREE.Vector3(4.576772,2.706693,23.622047),new THREE.Vector3(-4.970472,2.706693,23.622047),new THREE.Vector3(-4.970472,-2.903543,29.527559),new THREE.Vector3(-4.970472,-2.903543,23.622047),new THREE.Vector3(-4.970472,2.706693,29.527559),new THREE.Vector3(-4.970472,-2.903543,23.622047),new THREE.Vector3(-2.666708,-2.903543,26.156496),new THREE.Vector3(4.576772,-2.903543,23.622047),new THREE.Vector3(-4.970472,-2.903543,29.527559),new THREE.Vector3(-1.091905,-2.903543,26.156496),new THREE.Vector3(-2.666708,-2.903543,27.731299),new THREE.Vector3(0.698204,-2.903543,27.731299),new THREE.Vector3(2.273007,-2.903543,26.156496),new THREE.Vector3(4.576772,-2.903543,29.527559),new THREE.Vector3(2.273007,-2.903543,27.731299),new THREE.Vector3(0.698204,-2.903543,26.156496),new THREE.Vector3(-1.091905,-2.903543,27.731299),new THREE.Vector3(4.576772,2.706693,29.527559),new THREE.Vector3(-4.970472,2.706693,23.622047),new THREE.Vector3(4.576772,2.706693,23.622047),new THREE.Vector3(-4.970472,2.706693,29.527559),new THREE.Vector3(-4.970472,-2.903543,23.622047),new THREE.Vector3(-1.328740,-1.230315,23.622047),new THREE.Vector3(-4.970472,2.706693,23.622047),new THREE.Vector3(4.576772,-2.903543,23.622047),new THREE.Vector3(0.935039,-1.230315,23.622047),new THREE.Vector3(0.935039,1.033465,23.622047),new THREE.Vector3(-1.328740,1.033465,23.622047),new THREE.Vector3(4.576772,2.706693,23.622047),new THREE.Vector3(-1.091905,-2.903543,27.731299),new THREE.Vector3(-2.666708,-4.084646,27.731299),new THREE.Vector3(-2.666708,-2.903543,27.731299),new THREE.Vector3(-1.091905,-4.084646,27.731299),new THREE.Vector3(-2.666708,-2.903543,26.156496),new THREE.Vector3(-2.666708,-4.084646,27.731299),new THREE.Vector3(-2.666708,-4.084646,26.156496),new THREE.Vector3(-2.666708,-2.903543,27.731299),new THREE.Vector3(-1.091905,-2.903543,27.731299),new THREE.Vector3(-1.091905,-4.084646,26.156496),new THREE.Vector3(-1.091905,-4.084646,27.731299),new THREE.Vector3(-1.091905,-2.903543,26.156496),new THREE.Vector3(-2.666708,-4.084646,26.156496),new THREE.Vector3(-1.091905,-4.084646,27.731299),new THREE.Vector3(-1.091905,-4.084646,26.156496),new THREE.Vector3(-2.666708,-4.084646,27.731299),new THREE.Vector3(-1.091905,-2.903543,27.731299),new THREE.Vector3(-2.666708,-2.903543,26.156496),new THREE.Vector3(-1.091905,-2.903543,26.156496),new THREE.Vector3(-2.666708,-2.903543,27.731299),new THREE.Vector3(-1.091905,-4.084646,26.156496),new THREE.Vector3(-2.666708,-2.903543,26.156496),new THREE.Vector3(-2.666708,-4.084646,26.156496),new THREE.Vector3(-1.091905,-2.903543,26.156496),new THREE.Vector3(2.273007,-2.903543,27.731299),new THREE.Vector3(0.698204,-4.084646,27.731299),new THREE.Vector3(0.698204,-2.903543,27.731299),new THREE.Vector3(2.273007,-4.084646,27.731299),new THREE.Vector3(0.698204,-4.084646,26.156496),new THREE.Vector3(2.273007,-4.084646,27.731299),new THREE.Vector3(2.273007,-4.084646,26.156496),new THREE.Vector3(0.698204,-4.084646,27.731299),new THREE.Vector3(2.273007,-2.903543,27.731299),new THREE.Vector3(0.698204,-2.903543,26.156496),new THREE.Vector3(2.273007,-2.903543,26.156496),new THREE.Vector3(0.698204,-2.903543,27.731299),new THREE.Vector3(2.273007,-4.084646,26.156496),new THREE.Vector3(0.698204,-2.903543,26.156496),new THREE.Vector3(0.698204,-4.084646,26.156496),new THREE.Vector3(2.273007,-2.903543,26.156496),new THREE.Vector3(2.273007,-2.903543,27.731299),new THREE.Vector3(2.273007,-4.084646,26.156496),new THREE.Vector3(2.273007,-4.084646,27.731299),new THREE.Vector3(2.273007,-2.903543,26.156496),new THREE.Vector3(0.698204,-2.903543,26.156496),new THREE.Vector3(0.698204,-4.084646,27.731299),new THREE.Vector3(0.698204,-4.084646,26.156496),new THREE.Vector3(0.698204,-2.903543,27.731299)];
    
    this.materials = [new THREE.MeshBasicMaterial({opacity:1.000000,color:0xffffff}),new THREE.MeshBasicMaterial({opacity:1.000000,color:0xff3f00})];
    
    // Faces
    each([[0,1,2,0],[1,0,3,0],[1,0,2,1],[0,1,3,1],[4,5,6,0],[5,4,7,0],[7,4,8,0],[5,4,6,1],[4,5,7,1],[4,7,8,1],[9,10,11,0],[10,9,12,0],[12,9,13,0],[10,9,11,1],[9,10,12,1],[9,12,13,1],[14,15,16,0],[15,17,18,0],[17,15,19,0],[19,15,14,0],[15,14,16,1],[17,15,18,1],[15,17,19,1],[15,19,14,1],[20,21,22,0],[21,20,23,0],[23,20,24,0],[24,20,25,0],[21,20,22,1],[20,21,23,1],[20,23,24,1],[20,24,25,1],[26,27,28,0],[27,26,29,0],[27,26,28,1],[26,27,29,1],[30,31,32,0],[31,30,33,0],[31,30,32,1],[30,31,33,1],[34,35,36,0],[35,34,37,0],[35,34,36,1],[34,35,37,1],[38,39,40,0],[39,38,41,0],[39,38,40,1],[38,39,41,1],[42,43,44,0],[43,42,45,0],[45,42,46,0],[43,42,44,1],[42,43,45,1],[42,45,46,1],[47,48,49,0],[48,47,50,0],[50,47,51,0],[48,47,49,1],[47,48,50,1],[47,50,51,1],[52,53,54,0],[53,55,56,0],[55,53,57,0],[57,53,52,0],[53,52,54,1],[55,53,56,1],[53,55,57,1],[53,57,52,1],[58,59,60,0],[59,58,61,0],[61,58,62,0],[62,58,63,0],[59,58,60,1],[58,59,61,1],[58,61,62,1],[58,62,63,1],[64,65,66,0],[65,64,67,0],[65,64,66,1],[64,65,67,1],[68,69,70,0],[69,68,71,0],[69,68,70,1],[68,69,71,1],[72,73,74,0],[73,72,75,0],[73,72,74,1],[72,73,75,1],[76,77,78,0],[77,76,79,0],[77,76,78,1],[76,77,79,1],[80,81,82,0],[81,80,83,0],[83,80,84,0],[84,80,85,0],[81,80,82,1],[80,81,83,1],[80,83,84,1],[80,84,85,1],[86,87,88,0],[87,86,89,0],[87,86,88,1],[86,87,89,1],[90,91,92,0],[91,93,94,0],[93,91,95,0],[95,91,90,0],[91,90,92,1],[93,91,94,1],[91,93,95,1],[91,95,90,1],[96,97,98,0],[97,96,99,0],[97,96,98,1],[96,97,99,1],[100,101,102,0],[101,100,103,0],[103,100,104,0],[101,100,102,1],[100,101,103,1],[100,103,104,1],[105,106,107,0],[106,105,108,0],[106,105,107,1],[105,106,108,1],[109,110,111,0],[110,109,112,0],[112,109,113,0],[110,109,111,1],[109,110,112,1],[109,112,113,1],[114,115,116,0],[115,114,117,0],[117,114,118,0],[115,114,116,1],[114,115,117,1],[114,117,118,1],[119,120,121,0],[120,119,122,0],[122,119,123,0],[123,119,124,0],[120,119,121,1],[119,120,122,1],[119,122,123,1],[119,123,124,1],[125,126,127,0],[126,125,128,0],[126,125,127,1],[125,126,128,1],[129,130,131,0],[130,129,132,0],[130,129,131,1],[129,130,132,1],[133,134,135,0],[134,133,136,0],[134,133,135,1],[133,134,136,1],[137,138,139,0],[138,137,140,0],[138,137,139,1],[137,138,140,1],[141,142,143,0],[142,141,144,0],[142,141,143,1],[141,142,144,1],[145,146,147,0],[146,145,148,0],[148,145,149,0],[146,145,147,1],[145,146,148,1],[145,148,149,1],[150,151,152,0],[151,150,153,0],[151,153,154,0],[153,150,155,0],[155,150,156,0],[154,157,158,0],[157,154,159,0],[159,154,153,0],[157,159,156,0],[157,156,150,0],[157,150,160,0],[157,160,161,0],[151,150,152,1],[150,151,153,1],[153,151,154,1],[150,153,155,1],[150,155,156,1],[157,154,158,1],[154,157,159,1],[154,159,153,1],[159,157,156,1],[156,157,150,1],[150,157,160,1],[160,157,161,1],[162,163,164,0],[163,162,165,0],[163,162,164,1],[162,163,165,1],[166,167,168,0],[167,166,169,0],[167,166,168,1],[166,167,169,1],[170,171,172,0],[171,170,173,0],[173,170,174,0],[173,174,175,0],[175,174,176,0],[175,176,177,0],[171,170,172,1],[170,171,173,1],[170,173,174,1],[174,173,175,1],[174,175,176,1],[176,175,177,1],[178,179,180,0],[179,181,182,0],[181,179,183,0],[183,179,178,0],[179,178,180,1],[181,179,182,1],[179,181,183,1],[179,183,178,1],[184,185,186,0],[185,184,187,0],[185,187,188,0],[188,187,189,0],[188,189,190,0],[189,187,191,0],[191,187,192,0],[186,193,194,0],[193,186,185,0],[194,193,190,0],[194,190,195,0],[195,190,189,0],[194,195,192,0],[194,192,187,0],[185,184,186,1],[184,185,187,1],[187,185,188,1],[187,188,189,1],[189,188,190,1],[187,189,191,1],[187,191,192,1],[193,186,194,1],[186,193,185,1],[193,194,190,1],[190,194,195,1],[190,195,189,1],[195,194,192,1],[192,194,187,1],[196,197,198,0],[197,196,199,0],[197,196,198,1],[196,197,199,1],[200,201,202,0],[201,200,203,0],[203,200,204,0],[204,200,205,0],[201,200,202,1],[200,201,203,1],[200,203,204,1],[200,204,205,1],[206,207,208,0],[207,206,209,0],[207,206,208,1],[206,207,209,1],[210,211,212,0],[211,213,214,0],[213,211,215,0],[215,211,210,0],[211,210,212,1],[213,211,214,1],[211,213,215,1],[211,215,210,1],[216,217,218,0],[217,216,219,0],[217,216,218,1],[216,217,219,1],[220,221,222,0],[221,220,223,0],[221,220,222,1],[220,221,223,1],[224,225,226,0],[225,224,227,0],[225,224,226,1],[224,225,227,1],[228,229,230,0],[229,228,231,0],[229,228,230,1],[228,229,231,1],[232,233,234,0],[233,232,235,0],[233,232,234,1],[232,233,235,1],[236,237,238,0],[237,236,239,0],[237,236,238,1],[236,237,239,1],[240,241,242,0],[241,240,243,0],[241,240,242,1],[240,241,243,1],[244,245,246,0],[245,244,247,0],[245,244,246,1],[244,245,247,1],[248,249,250,0],[249,248,251,0],[249,248,250,1],[248,249,251,1],[252,253,254,0],[253,252,255,0],[254,253,256,0],[253,255,257,0],[257,255,258,0],[254,259,260,0],[259,254,256,0],[260,259,261,0],[260,261,258,0],[260,258,255,0],[256,262,259,0],[262,256,263,0],[262,263,258,0],[258,263,257,0],[253,252,254,1],[252,253,255,1],[253,254,256,1],[255,253,257,1],[255,257,258,1],[259,254,260,1],[254,259,256,1],[259,260,261,1],[261,260,258,1],[258,260,255,1],[262,256,259,1],[256,262,263,1],[263,262,258,1],[263,258,257,1],[264,265,266,0],[265,264,267,0],[265,264,266,1],[264,265,267,1],[268,269,270,0],[269,268,271,0],[269,271,272,0],[272,271,273,0],[270,274,275,0],[274,270,269,0],[275,274,273,0],[275,273,271,0],[269,268,270,1],[268,269,271,1],[271,269,272,1],[271,272,273,1],[274,270,275,1],[270,274,269,1],[274,275,273,1],[273,275,271,1],[276,277,278,0],[277,276,279,0],[277,276,278,1],[276,277,279,1],[280,281,282,0],[281,280,283,0],[281,280,282,1],[280,281,283,1],[284,285,286,0],[285,284,287,0],[285,284,286,1],[284,285,287,1],[288,289,290,0],[289,288,291,0],[289,288,290,1],[288,289,291,1],[292,293,294,0],[293,292,295,0],[293,292,294,1],[292,293,295,1],[296,297,298,0],[297,296,299,0],[297,296,298,1],[296,297,299,1],[300,301,302,0],[301,300,303,0],[301,300,302,1],[300,301,303,1],[304,305,306,0],[305,304,307,0],[305,304,306,1],[304,305,307,1],[308,309,310,0],[309,308,311,0],[309,308,310,1],[308,309,311,1],[312,313,314,0],[313,312,315,0],[313,312,314,1],[312,313,315,1],[316,317,318,0],[317,316,319,0],[317,316,318,1],[316,317,319,1],[320,321,322,0],[321,320,323,0],[321,320,322,1],[320,321,323,1]], function(triangle) {
      self.faces.push(new THREE.Face3(
        triangle[0],
        triangle[1],
        triangle[2],
        null,
        null,
        triangle[3]
      ));
    });
    
    // UVs
    each([null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], function(uvs) {
      self.faceUvs.push(uvs == null ? uvs : [
        new THREE.UV(uvs[0][0], uvs[0][1]),
        new THREE.UV(uvs[1][0], uvs[1][1]),
        new THREE.UV(uvs[2][0], uvs[2][1])
      ]);
    });
    
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
  }
  Model.prototype = new THREE.Geometry();
  Model.prototype.constructor = Model;
  Model.bounds = {
    width:  19.291339,
    height: 9.645669,
    depth:  29.527559
  };
  
  Model.camera = {
    position:       new THREE.Vector3(-25.167663,-197.392224,76.632197),
    targetPosition: new THREE.Vector3(18.924407,-4.289878,10.694876)
  };
  
  window["simple_robot"] = Model;
  return Model;
})();
