import levelConfig from '../data/levelConfig';

const GetRandomGate = (gateList) => {
    const randomIndex = Math.floor(Math.random() * gateList.length);

    return gateList[randomIndex];
  };

const generatePuzzle = (level) => {
    const config = levelConfig[level];

    const allInputs = {
      A: Math.round(Math.random()),
      B: Math.round(Math.random()),
      C: Math.round(Math.random()),
      D: Math.round(Math.random()),
    };

    const inputKeys= Object.keys(allInputs).slice(0,config.inputCount)

    const inputs = {};

    inputKeys.forEach((key)=>{
      inputs[key]=allInputs[key]
    });

    const gates = []

    if(level <= 2){
      gates.push({
        id:1,
        type: GetRandomGate(config.availableGates),
        input1:'A',
        input2:'B',
        output: 'Final'
      });
    } else if(level === 3){
      gates.push({
        id:1,
        type: GetRandomGate(config.availableGates),
        input1:'A',
        input2:'B',
        output: 'X'
      });
      gates.push({
        id:2,
        type: GetRandomGate(config.availableGates),
        input1:'X',
        input2:'C',
        output: 'Final'
      });
    } else{
      gates.push({
        id:1,
        type: GetRandomGate(config.availableGates),
        input1:'A',
        input2:'B',
        output: 'X'
      });
      gates.push({
        id:2,
        type: GetRandomGate(config.availableGates),
        input1:'C',
        input2:'D',
        output: 'Y'
      });
      gates.push({
        id:3,
        type: GetRandomGate(config.availableGates),
        input1:'X',
        input2:'Y',
        output: 'Final'
      });
    };

    return {
      level,
      inputs,
      gates
    };
  };

export default generatePuzzle;