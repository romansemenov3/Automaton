function main() {
    $('.jsDraggableForm').draggable();
    $('#connector').connector({
        from: $('#from')[0],
        to: $('#to')[0]
    });
}