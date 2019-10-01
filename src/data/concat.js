/**
  @function dataConcat
  @desc Reduce and concat all the elements included in arrayOfArrays if they are arrays. If it is a JSON object try to concat the array under given key data. If the key doesn't exists in object item, a warning message is lauched to the console. You need to implement DataFormat callback to concat the arrays manually.
  @param {Array} arrayOfArray Array of elements
  @param {String} [data = "data"] The key used for the flat data array if exists inside of the JSON object.
*/
export default (arrayOfArrays, data = "data") =>
  arrayOfArrays.reduce((acc, item) => {
    let dataArray = [];
    if (Array.isArray(item)) {
      dataArray = item;
    }
    else {
      if (item[data]) {
        dataArray = item[data];
      }
      else {
        console.warn("d3plus-Viz: Please implement \"DataFormat\" callback to concat the arrays manually (consider use d3plus.dataConcat method in your callback). The following object has not \"data\" property:", item);
      }
    }
    return acc.concat(dataArray);
  }, []);

