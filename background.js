/*--------------------------------------------------------------
>>> BACKGROUND:
----------------------------------------------------------------
# Database
# History
# Shelf
# Events
	# Created
	# Changed
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
			
			//object.createIndex('domainIndex', 'domain');
		};

		request.onsuccess = function () {
			DB.request = this.result;

			callback();
		};
	},
	put: function(store_name, item) {
		var transaction = this.request.transaction(store_name, 'readwrite'),
			object_store = transaction.objectStore(store_name);

		object_store.put(item);
	}
};





/*--------------------------------------------------------------
# HISTORY
--------------------------------------------------------------*/

function history(item) {
	chrome.downloads.erase({
		id: item.id
	});
}





/*--------------------------------------------------------------
# SHELF
--------------------------------------------------------------*/

function shelf() {
	chrome.downloads.setShelfEnabled(false);
}





/*--------------------------------------------------------------
# EVENTS
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

	if ('arc bz bz2 gz jar rar tar zip 7z'.indexOf(type) !== -1) {
		type = 'archive';
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

	shelf();
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
# INITIALIZATION
--------------------------------------------------------------*/

DB.open(function() {
	
});
