/* eslint-disable no-unused-vars */
const moment = require('moment');
const chalk = require('chalk');
const loForEach = require('lodash/forEach');
const logger = require('../../../logger');

module.exports = async function (data, actionResult) {
  let dataItems, histOpcuaValues = [], values = [], accumulator;
  let start, end;
  //-----------------------------------
  const tagName = data.nameNodeIds;
  const actionResultLength = actionResult.length;
  const actionResultStatusCode = (actionResult[0].statusCode.value === 0) ? 'Good' : 'Error';
  if (actionResultLength && actionResultStatusCode === 'Good') {
    const dataValuesLength = actionResult[0].historyData.dataValues.length;
    if (dataValuesLength) {
      const dataValues = actionResult[0].historyData.dataValues;
      dataValues.forEach(dataValue => {
        const dataValueStatusCode = (dataValue.statusCode.value === 0) ? 'Good' : 'Error';
        if (dataValueStatusCode === 'Good') {
          const updatedAt = moment(dataValue.sourceTimestamp).format('YYYY-MM-DDTHH:mm:ss');
          dataItems = JSON.parse(dataValue.value.value);
          accumulator = '';
          values = [];
          loForEach(dataItems, function (value, key) {
            values.push({ key, value });
          });
          histOpcuaValues.push({ tagName, updatedAt, opcuaData: values });
        } else {
          logger.error(`controllers.cbSessionReadHistoryValues.dataValueStatusCode: ${chalk.yellow(dataValueStatusCode)}`);
        }
      });
    } else {
      logger.error(`controllers.cbSessionReadHistoryValues.dataValuesLength: ${chalk.yellow(dataValuesLength)}`);
    }
  } else {
    logger.error(`controllers.cbSessionReadHistoryValues.actionResultLength: ${chalk.yellow(actionResultLength)} && actionResultStatusCode: ${chalk.yellow(actionResultStatusCode)}`);
  }
  if(histOpcuaValues.length){
    accumulator = histOpcuaValues.length;
    start = histOpcuaValues[0].updatedAt;
    end = histOpcuaValues[accumulator - 1].updatedAt;
    logger.info(`-----( ${chalk.yellow(tagName)} )-----`);
    logger.info(`sessionHistoryValue.StartTime: ${chalk.yellow(start)}`);
    logger.info(`sessionHistoryValue.EndTime: ${chalk.yellow(end)}`);
    logger.info(`sessionReadHistoryValues.count: ${chalk.yellow(accumulator)}`);
  }
  return histOpcuaValues;
};