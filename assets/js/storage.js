function Storage(keyName)
{
	var me = this;

	me.keyName = typeof keyName === 'undefined' ? 'contacts' : keyName;

	// Save data to Local Storage
	me.save = function(data)
	{
		return localStorage.setItem(me.keyName, data);
	}

	// Load data from Local Storage
	me.load = function()
	{
		return localStorage.getItem(me.keyName);
	}

	me.remove = function()
	{
		return localStorage.removeItem(me.keyName);
	}

	// Check if HTML5 Local Storage is available
	me.isAvailable = function()
	{
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
}
