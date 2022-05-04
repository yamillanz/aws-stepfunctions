const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();


const invokeLambda = async (lambdaFunctionName, payload = '') => {
  console.log('>>> Entering invokeLambda');

  // If the payload isn't a JSON string, we convert it to JSON
  let payloadStr;
  if (typeof payload === 'string') {
    console.log(
      'invokeLambda:  payload parameter is already a string: ',
      payload
    );
    payloadStr = payload;
  } else {
    payloadStr = JSON.stringify(payload, null, 2);
    console.log(
      'invokeLambda: converting payload parameter to a string: ',
      payloadStr
    );
  }

  let params = {
    FunctionName: lambdaFunctionName /* string type, required */,
    // ClientContext  : '',                               /* 'STRING_VALUE' */
    InvocationType:
      'RequestResponse' /* string type: 'Event' (async)| 'RequestResponse' (sync) | 'DryRun' (validate parameters y permissions) */,
    // InvocationType : 'Event',

    LogType: 'None' /* string type: 'None' | 'Tail' */,
    // LogType        : 'Tail',
    Payload:
      payloadStr /* Buffer.from('...') || 'JSON_STRING' */ /* Strings will be Base-64 encoded on your behalf */,
    //  Qualifier      : '',                             /* STRING_VALUE' */
  };

  //
  // TODO/FIXME: add try/catch to protect this code from failures (non-existent lambda, execution errors in lambda)
  //
  const lambdaResult = await lambda.invoke(params).promise();

  console.log(
    'Results from invoking lambda ' + lambdaFunctionName + ': ',
    JSON.stringify(lambdaResult, null, 2)
  );

  // If you use LogType = 'Tail', you'll obtain the logs in lambdaResult.LogResult.
  // If you use 'None', there will not exist that field in the response.
  if (lambdaResult.LogResult) {
    console.log(
      'Logs of lambda execution: ',
      Buffer.from(lambdaResult.LogResult, 'base64').toString()
    );
  }

  console.log('invokeLambdaSync::lambdaResult: ', lambdaResult);

  console.log(
    '<<< Returning from invokeLambda, with lambdaResult: ',
    JSON.stringify(lambdaResult, null, 2)
  );

  // The actual value returned by the lambda it is lambdaResult.Payload
  // There are other fields (some of them are optional)
  return lambdaResult;
};

module.exports = { invokeLambda };
