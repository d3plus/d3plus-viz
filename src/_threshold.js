import {sum} from "d3-array";
import {merge} from "d3plus-common";

/**
 * Merges items in an array, according to a defined threshold value.
 * @param {Array} flatData The currently filtered dataset
 * @param {Number} threshold The percentage value of the threshold limit.
 * @param {Function} valueAccesor An accesor function to the value of each item.
 * @param {Object} aggregators The aggregators for the current d3plus.Viz instance.
 */
export default function(flatData, threshold, valueAccesor, aggregators) {
  if (typeof threshold !== "number" || threshold <= 0) return flatData;
  if (threshold > 1) return [];

  const filteredData = flatData.slice();
  const mergeBucket = [];

  const valueSum = sum(flatData, valueAccesor);
  const thresholdValue = threshold * valueSum;

  // to filter item manually, let's iterate backwards
  let n = filteredData.length;
  while (n--) {
    const item = filteredData[n];
    if (valueAccesor(item) < thresholdValue) {
      filteredData.splice(n, 1);
      mergeBucket.push(item);
    }
  }

  // at this point filteredData only contains elements above threshold
  if (mergeBucket.length > 0) {
    const mergedItem = merge(mergeBucket, aggregators);
    mergedItem._isAggregated = true;
    filteredData.push(mergedItem);
  }

  return filteredData;
}
