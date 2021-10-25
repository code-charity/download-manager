/*--------------------------------------------------------------
>>> SCRIPT:
----------------------------------------------------------------
# Skeleton
# Initialization
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# SKELETON
--------------------------------------------------------------*/

var skeleton = {
	component: 'base',

	header: {
		component: 'header',

		section_1: {
			component: 'section',
			variant: 'align-start',

			title: {
				component: 'span',
				variant: 'title'
			}
		},
		section_2: {
			component: 'section',
			variant: 'align-end',

			menu: {
                component: 'button',
                on: {
                    click: {
                        component: 'modal',
                        variant: 'vertical',

                        label: {
                        	component: 'span',
                        	text: 'theme'
                        },
                        theme: {
                        	component: 'tabs',
                        	items: [
                        		'light',
                        		'dark',
                        		'black'
                        	]
                        },
                        divider: {
                        	component: 'divider'
                        },
                        language: {
							component: 'select',
							on: {
								change: function (name, value) {
									var self = this;

									satus.ajax('_locales/' + this.querySelector('select').value + '/messages.json', function (response) {
										response = JSON.parse(response);

										for (var key in response) {
											satus.locale.strings[key] = response[key].message;
										}

										self.base.skeleton.header.section_1.title.rendered.textContent = satus.locale.get('languages');

										self.base.skeleton.layers.rendered.update();
									});
								}
							},
							options: [{
								value: 'en',
								text: 'English'
							}, {
								value: 'ru',
								text: 'Русский'
							}],

							svg: {
								component: 'svg',
								attr: {
									'viewBox': '0 0 24 24',
									'fill': 'currentColor'
								},

								path: {
									component: 'path',
									attr: {
										'd': 'M12.9 15l-2.6-2.4c1.8-2 3-4.2 3.8-6.6H17V4h-7V2H8v2H1v2h11.2c-.7 2-1.8 3.8-3.2 5.3-1-1-1.7-2.1-2.3-3.3h-2c.7 1.6 1.7 3.2 3 4.6l-5.1 5L4 19l5-5 3.1 3.1.8-2zm5.6-5h-2L12 22h2l1.1-3H20l1.1 3h2l-4.5-12zm-2.6 7l1.6-4.3 1.6 4.3H16z'
									}
								}
							},
							label: {
								component: 'span',
								text: 'language'
							}
						},
                        erase: {
                        	component: 'switch',

                        	svg: {
								component: 'svg',
								attr: {
									'viewBox': '0 0 24 24',
									'fill': 'currentColor'
								},

								path_0: {
									component: 'path',
									attr: {
										'd': 'M15 2h-3.5l-1-1h-5l-1 1H1v2h14zM16 9c-.7 0-1.37.1-2 .29V5H2v12c0 1.1.9 2 2 2h5.68A6.999 6.999 0 0 0 23 16c0-3.87-3.13-7-7-7zm-7 7c0 .34.03.67.08 1H4V7h8v3.26c-1.81 1.27-3 3.36-3 5.74zm7 5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'
									}
								},
								path_1: {
									component: 'path',
									attr: {
										'd': 'M16.5 12H15v5l3.6 2.1.8-1.2-2.9-1.7z'
									}
								}
							},
							label: {
								component: 'span',
								text: 'autoErase'
							}
                        },
                        shelf: {
                        	component: 'switch',
                        	value: true,

                        	svg: {
								component: 'svg',
								attr: {
									'viewBox': '0 0 24 24',
									'fill': 'currentColor'
								},

								path: {
									component: 'path',
									attr: {
										'd': 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z'
									}
								}
							},
							label: {
								component: 'span',
								text: 'shelf'
							}
                        }
                    }
                },

                svg: {
                    component: 'svg',
                    attr: {
                        'viewBox': '0 0 24 24',
                        'fill': 'currentColor'
                    },

                    circle_1: {
                        component: 'circle',
                        attr: {
                            'cx': '12',
                            'cy': '5.25',
                            'r': '1'
                        }
                    },
                    circle_2: {
                        component: 'circle',
                        attr: {
                            'cx': '12',
                            'cy': '12',
                            'r': '1'
                        }
                    },
                    circle_3: {
                        component: 'circle',
                        attr: {
                            'cx': '12',
                            'cy': '18.75',
                            'r': '1'
                        }
                    }
                }
            }
		}
	},
	layers: {
		component: 'layers',
		on: {
			open: function () {
				var skeleton = this.path[this.path.length - 1],
					parent = skeleton.parent,
					section = this.base.skeleton.header.section_1,
					is_home = this.path.length <= 1,
					title = 'Download Manager';

				if (parent) {
					if (parent.label) {
						title = parent.label.text;
					} else if (parent.text) {
						title = parent.text;
					}
				}

				section.title.rendered.innerText = satus.locale.get(title);
			}
		},
		section: {
			component: 'section',
			variant: 'card',
			on: {
				render: function () {
					var section = this;

					chrome.runtime.sendMessage({
						action: 'get-downloads'
					}, function (items) {
						for (var i = 0, l = items.length; i < l; i++) {
							var item = items[i],
								name = item.name,
								path = 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z';

							if (name.length === 0) {
								name = item.url;
							}

							if (item.type === 'application') {
								path = 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z';
							} else if (item.type === 'archive') {
								path = 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h-2V8h2v2h2v2z';
							} else if (item.type === 'audio') {
								path = 'M12 3v9.28a4.39 4.39 0 0 0-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z';
							} else if (item.type === 'font') {
								path = 'M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z';
							} else if (item.type === 'image') {
								path = 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z';
							} else if (item.type === 'model') {
								path = 'm18.25 7.6-5.5-3.18a1.49 1.49 0 0 0-1.5 0L5.75 7.6c-.46.27-.75.76-.75 1.3v6.35c0 .54.29 1.03.75 1.3l5.5 3.18c.46.27 1.04.27 1.5 0l5.5-3.18c.46-.27.75-.76.75-1.3V8.9c0-.54-.29-1.03-.75-1.3zM7 14.96v-4.62l4 2.32v4.61l-4-2.31zm5-4.03L8 8.61l4-2.31 4 2.31-4 2.32zm1 6.34v-4.61l4-2.32v4.62l-4 2.31zM7 2H3.5C2.67 2 2 2.67 2 3.5V7h2V4h3V2zm10 0h3.5c.83 0 1.5.67 1.5 1.5V7h-2V4h-3V2zM7 22H3.5c-.83 0-1.5-.67-1.5-1.5V17h2v3h3v2zm10 0h3.5c.83 0 1.5-.67 1.5-1.5V17h-2v3h-3v2z';
							} else if (item.type === 'text' || item.type === 'multipart') {
								path = 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z';
							} else if (item.type === 'video') {
								path = 'm18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z';
							}

							satus.render({
								component: 'button',
								attr: {
									'title': item.url
								},
								item: item,
								contextMenu: {
									remove: {
										component: 'button',
										text: 'remove',
										on: {
											click: function () {
												var modal = this.parentNode.parentNode,
													parent = modal.skeleton.parent;

												chrome.runtime.sendMessage({
													action: 'delete',
													id: item.id
												});

												parent.rendered.remove();

												modal.close();
											}
										}
									}
								},

								svg: {
									component: 'svg',
									attr: {
										'viewBox': '0 0 24 24',
										'fill': 'currentColor'
									},

									path_0: {
										component: 'path',
										attr: {
											'd': path
										}
									}
								},
								label: {
									component: 'span',
									variant: 'label',
									text: name
								}
							}, section);
						}
					});
				}
			}
		}
	}
};


/*--------------------------------------------------------------
# INITIALIZATION
--------------------------------------------------------------*/

satus.storage.attributes = {
    theme: true
};

satus.storage.import(function (items) {
	satus.locale.import(items.language, '../_locales/', function () {
		satus.render(skeleton);
	});
});