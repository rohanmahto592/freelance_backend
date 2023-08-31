function rearrangeObjectKeysAlphabetically(obj) {
    const sortedKeys = Object.keys(obj).map(key => key.trim()).sort();
    const reorderedObject = Object.fromEntries(
      sortedKeys.map(key => [key, obj[key]])
    );
  
    return reorderedObject;
  }
module.exports=rearrangeObjectKeysAlphabetically;