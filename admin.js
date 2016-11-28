window.onload = function(){	

	var i=0;	
	var form = document.getElementById('form-options'),
		parent = document.getElementById('options'),	
		addOptionBtn = document.getElementById('btn-add-option'),		
		output = document.getElementById('output-msg');
		select = document.getElementById('selected-product');
		form.addEventListener('submit', function(e){			
			saveData(e, this, 'POST','price.php');
			
		});
		
		addOptionBtn.addEventListener('click', function(e){
			addNewOption.call(form, i, parent);
			i++;
		});	
}

// Передаем данные на сервер
function saveData(event, object, method, pathfile){
	var output = document.getElementById('output-msg');

	var formData = new FormData(object);
	alert(formData);
	var request = new XMLHttpRequest();
	request.open(method, pathfile);

	request.onload = function(){
		if (this.readyState == 4) {
			if(this.status == 200) {
				output.innerHTML = this.responseText;
			}
		}
	}
	request.send(formData);
	event.preventDefault();
}

// Подгружаем превью продукта к варианту упаковки
function previewImage(node, files, index){
	
	var file = files[0];
	var imageType = /^image\//;
		
	var preview = node.nextSibling;
	
	if(!document.getElementById('preview'+index)) {
		var img = document.createElement('img');
		img.classList.add('obj');
		img.setAttribute('id', 'preview'+index);
		preview.appendChild(img);
	} else {
		var img = document.getElementById('preview'+index);
	}
		
	var reader = new FileReader();	
	reader.readAsDataURL(file);
	reader.onload = (function(aImg){
		return function(e){
			aImg.src = e.target.result;
		}
	})(img);	
}

// Создаем новый вариант упаковки, дополняем DOM динамически
function addNewOption(index, parent){
	
	var div = document.createElement('div');
	
	div.setAttribute('class','option-fields row');
	div.setAttribute('data-index', index);
	
	//Заносим значения полей в переменные
	var formGroupImage = '<label>Выбрать изображение продукта:</label><input type="file" name="image[]" id="image_'+index+'" class="form-control" accept="image/jpeg, image/png"/ onchange="previewImage(this, this.files,'+index+')"><div class="previews"></div>',
		formGroupPrice = '<label for="product-price">Цена:</label> <input type="text" name="price[]" id="price_'+index+'"  class="form-control"/>',
		formGroupPack = '<label for="product-pack">Упаковка:</label> <input type="text" name="pack[]" id="pack_'+index+'"  class="form-control">',
		formGroupUnit = '<label for="product-unit">Единица измерения:</label> <select  name="unit[]" id="unit_'+index+'" class="product__taste-list"><option value="ml">ml</option><option value="g">g</option></select>',
		formGroupTastes = '<label for="product-tastes">Вкусы:</label><textarea name="tastes[]" id="tastes_'+index+'" rows="5" cols="30"  class="form-control"></textarea>',
		formGroupAvailable = '<label for="product-available">Наличие:</label><input type="checkbox" name="available[]" id="available_'+index+'" class="form-control" value="no"  onclick="checkAvailable(this)">',
		
		formGroupBtnDelete = '<input type="button" class="btn btn-danger btn-delete" value="Удалить" onclick="deleteOption(this)">';
	
	// Заносим в массив
	var formGroups = [formGroupImage, formGroupPrice, formGroupPack, formGroupUnit, formGroupTastes, formGroupAvailable, formGroupBtnDelete];
	var cols = [4,1,1,1,3,1,1];
	// Создаем группы полей
	for (var i=0; i<formGroups.length; i++){
		var formGroup = document.createElement('div');
		formGroup.setAttribute('class', 'form-group col-md-'+cols[i]);
		formGroup.innerHTML = formGroups[i];		
		div.appendChild(formGroup);	
	}
	parent.appendChild(div);
}

// Удаляем вариант упаковки
function deleteOption(node){
	var nodeDeleted = node.parentNode.parentNode,
		parent = nodeDeleted.parentNode,
		index = nodeDeleted.getAttribute('data-index').value;
		
		parent.removeChild(nodeDeleted);
}

function checkAvailable(e){
	if (e.value=="no"){
		e.value ='yes'
	} else {
		e.value='no'
	}
}