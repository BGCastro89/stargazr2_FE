var control = L.control.range({
    position: 'topright',
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    orient: 'vertical',
    icon: false
});
control.on('change input', function(e) {
    // lightpollution2006.setOpacity(e.value / 100);
    lightpollution2016.setOpacity(e.value / 100);
})

map.addControl(control);
