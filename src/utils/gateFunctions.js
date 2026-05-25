const gateFunctions = {
    AND: (a,b) => a === 1 && b === 1? 1 : 0 ,
    OR: (a,b) => a=== 1 || b===1 ? 1 : 0,
    XOR: (a,b) => a !== b ? 1: 0
  };

  export default gateFunctions;