function Movies(storage)
{
	var me = this;

	me.autoIndex = 0;
	me.data = [];
	me.storage = storage;

	me.load = function()
	{
		var str = me.storage.load();
		var data = JSON.parse(str);
		if (data !== null) {
			me.autoIndex = data.autoIndex;
			me.data = data.data;
			for (var i in me.data) {
				if (me.data[i] === null) {
					delete me.data[i];
				}
			}
		}
	}

	me.save = function()
	{
		var str = JSON.stringify({autoIndex: me.autoIndex, data: me.data});
		me.storage.save(str);
	}

	me.find = function(filter)
	{
		var ids = [];
		for (var i in me.data) {
			var mov = me.get(i);
			if (mov.find(filter)) {
				ids.push(i);
			}
		}
		return ids;
	}

	me.get = function(index)
	{
		return new Movie(me, index);
	}

	me.update = function(index, mov)
	{
		if (index === null) {
			var index = me.autoIndex;
			me.autoIndex++;
		}

		me.data[index] = mov.toArray();
		return index;
	}

	me.remove = function(index)
	{
		delete me.data[index];
	}

	me.create = function()
	{
		return new Movie(me, null);
	}

	me.count = function()
	{
		var n = 0;
		for (var i in me.data) {
			n++;
		}
		return n;
	}

	me.getSortedData = function()
	{
		me.data.sort(function(a, b) {
			if(a.Id < b.Id) return -1;
	    if(a.Id > b.Id) return 1;
	    return 0;
		});
		return me.data;
	}
}

function Movie(parent, index)
{
	var me = this;

	me.refresh = function()
	{
		me.Id = index === null ? '' : parent.data[index][0];
		me.Title = index === null ? '' : parent.data[index][1];
		me.Genres = index === null ? '' : parent.data[index][2];
		me.Poster = index === null ? '' : parent.data[index][3];
	}

	me.find = function(search_filter)
	{
		for (var i in parent.data[index]) {
			if (i == 24) {
				continue;
			}
			if (parent.data[index][i].toLowerCase().search(search_filter.toLowerCase()) > -1) {
				return true;
			}
		}
		return false;
	}

	me.update = function()
	{
		var new_index = parent.update(index, me);
		if (index === null) {
			index = new_index;
		}
	}

	me.remove = function()
	{
		parent.remove(index);
	}

	me.toArray = function()
	{
		return [
			me.Id,
			me.Title,
			me.Genres,
			me.Poster
		];
	}

	me.refresh();
}