Plugins.esphome_tuner.no_css = true;


Plugins.esphome_tuner.base_url = "https://antenna-tuner.example.com"

Plugins.esphome_tuner.motor_switch = "/switch/Motor on"
Plugins.esphome_tuner.tune_up = "/button/Tune up"
Plugins.esphome_tuner.tune_down = "/button/Tune down"
Plugins.esphome_tuner.home_stepper = "/button/Home stepper"
Plugins.esphome_tuner.stepper_pos_url = "/number/Stepper target position"

Plugins.esphome_tuner.update_interval_ms = 1000;

Plugins.esphome_tuner.update_motor_status = function (resp_data) {
    let motorButton = $('#tuner-motor-on');
    let onCss = {
        color: "rgb(0,255,0)"
    };
    let offCss = {
        color: "white"
    };
    motorButton.css(resp_data.value ? onCss : offCss);
};

Plugins.esphome_tuner.refresh_motor_status = function () {
    $.ajax(`${Plugins.esphome_tuner.base_url}${Plugins.esphome_tuner.motor_switch}`,
        {
            success: this.update_motor_status
        });
}

Plugins.esphome_tuner.refresh_stepper_position = function () {
    $.ajax(`${Plugins.esphome_tuner.base_url}${Plugins.esphome_tuner.stepper_pos_url}`,
        {
            success: (resp_data) => $("#tuner-stepper-pos").text(resp_data.state)
        });
}

Plugins.esphome_tuner.update_ui_state = () => {
    Plugins.esphome_tuner.refresh_motor_status();
    Plugins.esphome_tuner.refresh_stepper_position();
}

Plugins.esphome_tuner.init = async function () {

    $("#openwebrx-sdr-profiles-listbox").parent().before(`<div class="openwebrx-panel-line" id="tuner-panel-main">
        <div class="openwebrx-button" id="tuner-tune-down">Tune -</div>
        <div class="openwebrx-button" id="tuner-motor-on">Motor on</div>
        <div class="openwebrx-button" id="tuner-tune-up">Tune +</div>
    </div>
    <div class="openwebrx-panel-line" id="tuner-panel-small">
        <div class="openwebrx-button tuner-preset">80m</div>
        <div class="openwebrx-button tuner-preset">40m</div>
        <div class="openwebrx-button tuner-preset">20m</div>
        <div class="openwebrx-button" id="tuner-home-stepper">Home</div>
        <div id="tuner-stepper-pos"></div>
    </div>`);

    $('#tuner-tune-down').on('click', function () {
        $.post(`${Plugins.esphome_tuner.base_url}${Plugins.esphome_tuner.tune_down}/press`, Plugins.esphome_tuner.update_ui_state);
    });

    $('#tuner-tune-up').on('click', function () {
        $.post(`${Plugins.esphome_tuner.base_url}${Plugins.esphome_tuner.tune_up}/press`, Plugins.esphome_tuner.update_ui_state);
    });

    $('#tuner-motor-on').on('click', function () {
        $.post(`${Plugins.esphome_tuner.base_url}${Plugins.esphome_tuner.motor_switch}/toggle`, Plugins.esphome_tuner.update_ui_state);
    });

    $('#tuner-home-stepper').on('click', function () {
        $.post(`${Plugins.esphome_tuner.base_url}${Plugins.esphome_tuner.home_stepper}/press`, () => Plugins.esphome_tuner.update_ui_state);
    });

    $("#tuner-stepper-pos").css({ float: "right", "font-family": "roboto-mono, monospace", "display": "inline-block" });

    $(".tuner-preset").on('click', function () {
        let presetName = $(this).text()
        $.post(`${Plugins.esphome_tuner.base_url}/button/${presetName}/press`, () => Plugins.esphome_tuner.update_ui_state);
    })

    setInterval(this.update_ui_state, Plugins.esphome_tuner.update_interval_ms);

    return true;
};

