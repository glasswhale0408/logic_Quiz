import gateFunctions from "./gateFunctions";

const solvePuzzle = (puzzle) => {
    const values = {
      ...puzzle.inputs
    };

    puzzle.gates.forEach((gate)=>{

      const a = values[gate.input1];
      const b = values[gate.input2];
      const result = gateFunctions[gate.type](a,b);

      values[gate.output]= 
      result
    });

    return values.Final;
  };

export default solvePuzzle;