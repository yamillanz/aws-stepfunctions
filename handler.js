'use strict';
const { StepFunctions } = require('aws-sdk');
const { invokeLambda } = require('./invokeLambda');

const startStepFunctionSyncP = async (params) => {
  const stepFunction = new StepFunctions();

  try {
    const { output } = await stepFunction.startSyncExecution(params).promise();
    console.log('StateMachine response', output);

    return {
      statusCode: 200,
      body: JSON.stringify({ result: output }),
    };
  } catch (error) {
    throw {
      status: 500,
      body: JSON.stringify({
        code: error.code ?? 'INTERNAL_SERVER_ERROR',
        message: error.message ?? 'INTERNAL SERVER ERROR',
      }),
    };
  }
};

module.exports.startSFMaths = async (event) => {
  console.log('startSFMaths >> event', event);
  const params = {
    stateMachineArn: process.env.SF_NAME,
    input: JSON.stringify(event.body),
  };

  return startStepFunctionSyncP(params);
};

//* FUNCTIONS **
module.exports.suma = async (data) => {
  const { x, y } = JSON.parse(data);
  const result = x + y;
  return { sumados: result };
};

module.exports.multiplicacion = async (data) => {
  const { sumados } = data;
  const { Payload } = await invokeLambda(process.env.ARN_RAMDON_FUNCTION, {
    pathParameters: { number: 20 },
  });

  console.log('multiplicado >> Payload', Payload, typeof Payload);

  // const newPayload = JSON.parse(Payload);
  // console.log('multiplicado >> newPayload', newPayload, typeof newPayload);
  const { statusCode, body } = JSON.parse(Payload);
  const { result } = JSON.parse(body);
  console.log('multiplicado >> ramdom', result);

  const total = sumados * result;
  return total;
};
