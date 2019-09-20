const fs = require ('fs');

const parseConfig = (file_path) => {
    if (fs.existsSync(file_path)) {
        const content = fs.readFileSync(file_path, 'utf-8');
        const trace = JSON.parse(content.toString());
        let error_messages = [];
        if (validate_config() (trace, error_messages)) return trace;
    } else {
        throw Error ('Config file missing:' + file_path);
    }
};

const validate_config = (trace_config, error_messages) => {
    if (trace_config.trace) return validate_trace (trace_config.trace, error_messages);
};

const valid_parameters = [
    'request.header.jsessionid',
    'request.url',
    'server.datetime.now'
];

const validate_trace = (trace, error_messages) => {
    validate_field(trace.request, error_messages, 'In config file, trace requires a request element');
    validate_field(trace.request.output_format, error_messages, 'In config file, trace.request request an output_format');
    validate_output_format (trace.request.output_format, valid_parameters);

    validate_field(trace.request.connector, error_messages, 'In config file, trce.request requires connector');
    validate_connector (trace.request.connector);
};

const validate_output_format = (format, accepted_parameters, list_of_errors) => {
    let result = true;
    const parameter_regex = /@{[a-z]+}/g;
    // const parameter_regex = /@{\w(\.\w)*}/g;
    for (let param in format.search(parameter_regex)) {
        const value = param.substr(2, param.length -1);
        if(!accepted_parameters.find(p => p === value)) {
            list_of_errors.push('In config file, parameter ' + value + 'is not defined');
            result = false;
        }
    }
    return result;
};

const validate_field = (field, list_of_errors, error_message) => {
    if (!field) {
        list_of_errors.push(error_message);
        return false;
    }
    return true;
};

module.exports = {
    validate_field,
    validate_output_format
};
