define(["dojo/_base/lang", "dojo/currency"], function(lang, currency) {
	/**
	 * Cell decorator for the details view.
	 */
	lang.setObject("eduDetailsViewDecorator", function(data, rowId, rowIndex) {
		if (data) {
			return currency.format(data);
		} else {
			return "";
		}
	});
	
	/**
	 * Cell decorator for the magazine view.
	 */
	lang.setObject("eduMagazineViewDecorator", function(cellWidget, domNode, name, value) {
		if (value) {
			return currency.format(value);
		} else {
			return "";
		}
	});
});