function getRandomNumber(difficulty) {
    const min = Math.pow(10, difficulty - 1);
    const max = Math.pow(10, difficulty) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getOperands(count , difficulty) {
    return Array(count).fill(0).map(() => getRandomNumber(difficulty));
}

function getOperators(difficulty) {
    const operators = ['+', '-', '*', '/'];
    return Array(difficulty).fill(0).map(() => operators[Math.floor(Math.random() * operators.length)]);
}

export function generateExpression(difficulty) {
    const count = difficulty + 1;
    const operands = getOperands(count, difficulty);
    const operators = getOperators(difficulty);
    let question = `${operands[0]}`;
    for (let i = 0; i < operators.length; i++) {
        question += ` ${operators[i]} ${operands[i + 1]}`;
    }
    return question;
}

export function evaluateExpression(expression) {
    try {
        const result = eval(expression);
        return result;
    }
    catch (error) {
        console.error("Error evaluating expression:", error);
        return null;
    }
}