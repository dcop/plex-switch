const util = require("util");
const { execSync } = require('child_process');
const execute = execSync;

const SERVICE_NAME = "openvpn.service" //plexmediaserver.service";

const ARGS = {
    "status": ["is-active", SERVICE_NAME],
    "enable": ["start", SERVICE_NAME],
    "disable": ["stop", SERVICE_NAME]
}

const ACTIONS = {
    "status": ARGS["status"].join(' '),
    "enable": ARGS["enable"].join(' '),
    "disable": ARGS["disable"].join(' ')
}

function PlexService() {
    return {
        enable,
        disable,
        status
    }

    function enable () {
        return doExecute('enable');
    }

    function disable () {
        return doExecute('disable');
    }

    function status () {
        const data = doExecute('status');

        return {
            active: isActive(data.value),
            ...data
        }
    }

    function doExecute(action = "status") {
        console.log("doExecute", action);

        try {
            // throws error on exit code !== 0
            return { value: execute("systemctl " + ACTIONS[action]).toString().trim() };
        } catch (err) {
            return handleError(err);
        }
    }

    function isActive(message = "") {
        console.log("isActive", message);

        return message === "active";
    }

    function handleError(err) {
        return { 
            stderr: err.stderr.toString().trim(),
            stdout: err.stdout.toString().trim()
         }; 
    }
}

module.exports = PlexService;