var site = location.protocol + "//" + location.host;

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

function request(url, data, onsuccess){
	var json = Ext.encode(data);
	Ext.Ajax.request({
		url: site + "/index.php/" + url,
		method: 'POST',
		params:{
			book: json
		},
		success: onsuccess,
		failure: function(response, options){
			alert("Ошибка: " + response.statusText);
		}
	}); 
}

function showBookForm(self, record, isFormForNewBook){

    var grid = Ext.ComponentQuery.query('#bookgrid')[0];
    var bookData, title;
    if(isFormForNewBook){
        title = "Добавить новую книгу";
        bookData = {
            bookName: "",
            bookAuthor: "",
            bookYear: "",
            bookGenre: ""
        }
    }else{
        bookData = record.getData();
        title = "Редактирование книги: " + bookData.bookName;
    }

    var formOpt = {
        width: 430,
        bodyPadding: 10,
        title: title,
        floating: true,
        modal:true,
        record: record,

        items:[
            {
                xtype: 'textfield',
                name: 'bookName',
                value: bookData.bookName,
                width: 400,
                fieldLabel: 'Название книги'
            },
            {
                xtype: 'textfield',
                name: 'bookAuthor',
                value: bookData.bookAuthor,
                width: 400,
                fieldLabel: 'Автор книги'
            },
            {
                xtype: 'textfield',
                name: 'bookYear',
                value: bookData.bookYear,
                width: 400,
                fieldLabel: 'Год выпуска'
            },
            {
                xtype: 'textfield',
                name: 'bookGenre',
                value: bookData.bookGenre,
                width: 400,
                fieldLabel: 'Жанр книги'
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        xtype: 'button',
                        text: 'Отмена',
                        handler: function() {
                            this.up('form').destroy();
                        }
                    }
                ]
            }
        ]
    }

    if(isFormForNewBook){
        formOpt.items[formOpt.items.length-1].items.unshift(
            {
                xtype: 'button',
                text: 'Добавить',
                handler: function(){
                    delete bookData.id;
                    Ext.ComponentQuery.query('panel > textfield').forEach(function(item, i){
                        bookData[item.getName()] = item.getValue();
                    });

                    if(isNumber(bookData.bookYear) && bookData.bookYear < 32767 && bookData.bookYear >= 0){
                        request("book/create", bookData, function(){grid.store.load()});
                        this.up('form').destroy();
                    }else{
                        alert("Год должен быть только не отрицательным целым числом, которое меньше 32767");
                    }
                }
            }
        );
    }else{
        formOpt.items[formOpt.items.length-1].items.unshift(
            {
                xtype: 'button',
                text: 'Обновить',
                handler: function() {
                    delete bookData.id;
                    Ext.ComponentQuery.query('panel > textfield').forEach(function(item, i){
                        bookData[item.getName()] = item.getValue();
                    });
                    if(isNumber(bookData.bookYear) && bookData.bookYear < 32767 && bookData.bookYear >= 0){
                        request("book/edit", bookData, function(){grid.store.load()});
                        this.up('form').destroy();
                    }else{
                        alert("Год должен быть только не отрицательным целым числом, которое меньше 32767");
                    }
                }
            },
            {
                xtype: 'button',
                text: 'Удалить',
                handler: function() {
                    delete bookData.id;
                    request("book/remove", bookData, function(){grid.store.load()});
                    this.up('form').destroy();
                }
            },
        );
    }

    new Ext.form.Panel(formOpt).show();
}

Ext.define('Book', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'bookName',  type: 'string'},
		{name: 'bookAuthor',   type: 'string'},
		{name: 'bookYear', type: 'int'},
		{name: 'bookGenre', type: 'string'}
	]
});

//var grid = Ext.ComponentQuery.query('#bookgrid')[0];

Ext.application({
	name: 'HelloExt',
	launch: function() {
		var vp = new Ext.container.Viewport({
			layout: 'fit',
			items:[
				{
					xtype: 'panel',
					items:[
						{
							xtype: 'toolbar',
                            height: 70,
                            dock: 'top',
                            items:[
                                {
                                    xtype: 'button',
                                    text: '+ Добавить новую книгу',
                                    handler: function(){
                                        showBookForm(null, null, true);
                                    }
                                },
                                "Нажмите на строку из таблицы с нужно вам книгой, чтобы редактировать или удалить её"
                            ]
						},
                        {
                            xtype: 'grid',
                            id: 'bookgrid',
                            listeners: {
                                itemclick: function(self, record){
                                    showBookForm(self, record, false);
                                }
                            },

                            columns:[
                                {
                                    text: 'Название',
                                    dataIndex: 'bookName',
                                    flex: 1
                                },
                                {
                                    text: 'Автор',
                                    dataIndex: 'bookAuthor',
                                    flex: 1
                                },
                                {
                                    text: 'Год выпуска',
                                    dataIndex: 'bookYear',
                                    flex: 1
                                },
                                {
                                    text: 'Жанр',
                                    dataIndex: 'bookGenre',
                                    flex: 1
                                }
                            ],

                            store:{
                                model: 'Book',
                                autoLoad: true,
                                proxy: {
                                    type: 'ajax',
                                    url: site + '/index.php/book/get',
                                    reader: {
                                        type: 'json'
                                    }
                                }
                            }
                        }
					]
				},
				
			]
		});
	}
});
					