/*--------------------------------------------------------------
>>> BACKGROUND:
----------------------------------------------------------------
# Database
# History
# Shelf
# Storage
	# Get
	# Changed
# Downloads
	# Created
	# Changed
# Messages

# Initialization
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# DATABASE
--------------------------------------------------------------*/

var DB = {
		ready: false,
		open: function (callback) {
			var request = indexedDB.open('download_manager');

			request.onupgradeneeded = function () {
				var object = this.result.createObjectStore('downloads', {
					keyPath: 'id'
				});
				
				object.createIndex('extension', 'extension');
				object.createIndex('id', 'id');
				object.createIndex('name', 'name');
				object.createIndex('size', 'size');
				object.createIndex('time', 'time');
				object.createIndex('type', 'type');
				object.createIndex('url', 'url');
			};

			request.onsuccess = function () {
				DB.request = this.result;

				if (callback) {
					callback();
				}
			};
		},
		put: function(store_name, item) {
			var transaction = this.request.transaction(store_name, 'readwrite'),
				object_store = transaction.objectStore(store_name);

			object_store.put(item);
		},
		get: function(store_name, index_name, callback, offset = false, direction = 'next') {
			var transaction = this.request.transaction(store_name, 'readonly'),
				object_store = transaction.objectStore(store_name).index(index_name),
				result = [];

			object_store.openCursor(null, direction).onsuccess = function(event) {
				var cursor = event.target.result;

				if (offset !== false) {
					cursor.advance(offset);

					offset = false;
				} else if (cursor && result.length < 100) {
					result.push(cursor.value);

					cursor.continue();
				} else {
					callback(result);
				}
			};
		},
		delete: function(store_name, index) {
			var transaction = this.request.transaction(store_name, 'readwrite'),
				object_store = transaction.objectStore(store_name);

			object_store.delete(index);
		}
	},
	storage = {};


/*--------------------------------------------------------------
# HISTORY
--------------------------------------------------------------*/

function history(item) {
	if (storage.erase === true) {
		chrome.downloads.erase({
			id: item.id
		});
	}
}


/*--------------------------------------------------------------
# SHELF
--------------------------------------------------------------*/

function shelf() {
	chrome.downloads.setShelfEnabled(storage.shelf);
}


/*--------------------------------------------------------------
# STORAGE
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# GET
--------------------------------------------------------------*/

chrome.storage.local.get(function (items) {
	storage = items;

	if (items.hasOwnProperty('shelf') === false) {
		storage.shelf = true;
	}

	shelf();
});


/*--------------------------------------------------------------
# CHANGE
--------------------------------------------------------------*/

chrome.storage.onChanged.addListener(function (changes) {
    for (var key in changes) {
    	storage[key] = changes[key].newValue;
    }

    if (changes.shelf) {
    	shelf();
    }
});


/*--------------------------------------------------------------
# DOWNLOADS
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# CREATED
--------------------------------------------------------------*/

chrome.downloads.onCreated.addListener(function(item) {
	var filename = item.filename,
			split = item.mime.split('/'),
			type = split[0];

	if (filename === '') {
		var match = item.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);

		if (match) {
			filename = match[0];
		}
	}

	for (var key in FILETYPE) {
		if (FILETYPE[key].indexOf(type)) {
			type = key;
		}
	}

	DB.put('downloads', {
		extension: split[1],
		id: item.id,
		name: filename,
		size: item.fileSize * 1e-6,
		time: new Date(item.startTime).getTime(),
		type: type,
		url: item.url
	});
});


/*--------------------------------------------------------------
# CHANGED
--------------------------------------------------------------*/

chrome.downloads.onChanged.addListener(function(item) {
	if (item.state && item.state.current === 'complete') {
		history(item);
	}
});


/*--------------------------------------------------------------
# MESSAGES
--------------------------------------------------------------*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action === 'get-downloads') {
		DB.get('downloads', 'time', function(items) {
			sendResponse(items);
		});

		return true;
	} else if (request.action === 'delete') {
		DB.delete('downloads', request.id);
	}
});


/*--------------------------------------------------------------
# INITIALIZATION
--------------------------------------------------------------*/

DB.open();