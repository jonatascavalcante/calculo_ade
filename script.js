$(document).ready(function() {
	var posto_graducao, data, qtd_anos, adis, adis_preenchidos;
	$("#data_entrada").val(getCurrentDate());
	createSelect();

	$("#bt_simular").click(function() {
		posto_graducao = $("#postos_graduacoes option:selected").text();
		data = $("#data_entrada").val();
		qtd_anos = parseInt($("#qtd_anos").val());
		adis = [];
		adis_preenchidos = 0;
		if(verifyFields(qtd_anos, data)) {
			if($("#dados_adis").is(':visible')) {
				$("#dados_adis").empty();
			}
			organizeADIStructure(qtd_anos, data, adis);
			$("#dados_adis").show();
			$("#resultado_ade").hide();
		} else {
			clearData();
		}
	});

	$("#dados_iniciais").delegate('select', 'change', function() {
		posto_graducao = $("#postos_graduacoes option:selected").text();
	});

	$("#data_entrada").change(function() {
		clearData();
	});

	$("#qtd_anos").change(function() {
		var antiga_qtd_anos = qtd_anos;
		qtd_anos = parseInt($("#qtd_anos").val());

		if(!verifyFields(qtd_anos, data)) {
			clearData();
		} else {

			if((antiga_qtd_anos < 3 || antiga_qtd_anos > 30) && data != undefined) {
				adis = [];
				adis_preenchidos = 0;
				organizeADIStructure(qtd_anos, data, adis);
				$("#dados_adis").show();
			} else if(antiga_qtd_anos > qtd_anos) {
				if(adis_preenchidos == antiga_qtd_anos)
					adis_preenchidos -= (antiga_qtd_anos - qtd_anos);
				removeDataInputs(antiga_qtd_anos, qtd_anos, adis);
				$("#calcular_ade").prop('disabled', false);
			} else if(qtd_anos > antiga_qtd_anos) {
				addDataInputs(antiga_qtd_anos, qtd_anos, data, adis);
			}
		}
	});

	$("#dados_adis").delegate('select', 'change', function() {
		var adi_corrente = {id: $(this).attr('id'), value: parseInt($(this).val())};

		$.grep(adis, function(adi) {
			if(adi.id === adi_corrente.id) {
				if(adi.value === 0)
					adis_preenchidos++;
				adi.value = adi_corrente.value;
				return;
			}
		});

		if(adi_corrente.value < 70) {
			$('#'+ adi_corrente.id).css("background-color", "red");
			$('#'+ adi_corrente.id).css("border-color", "red");
			$('#'+ adi_corrente.id).css("color", "white");
		} else if(adi_corrente.value <= 100) {
			$('#'+ adi_corrente.id).css("background-color", "green");
			$('#'+ adi_corrente.id).css("border-color", "green");
			$('#'+ adi_corrente.id).css("color", "white");
		}
		if(adis_preenchidos == qtd_anos) {
			$("#calcular_ade").prop('disabled', false);
		}
	});

	$("#dados_adis").delegate('button', 'click', function() {
		var salario_posto_grad = calculateSalary(posto_graducao);
		var resultado_calculo_padrao = calculateADE(adis, salario_posto_grad, qtd_anos);
		$("#resultado_ade").show();

		console.log(adis);
		if(qtd_anos < 30) {
			$("#qtd_adis_satisfatorias").html(resultado_calculo_padrao.adis_satisfatorias + '.');
			$("#ade").html((resultado_calculo_padrao.ade*100) + '%.');
			$("#ade_obtido").html(resultado_calculo_padrao.ade_obtida + '%.');
			$("#salario_inicial").html('R$' + convertToReal(salario_posto_grad) + '.');
			$("#aumento_ade").html('R$' + convertToReal(salario_posto_grad*resultado_calculo_padrao.ade_obtida/100) + '.');
			$("#salario_final").html('R$' + convertToReal(resultado_calculo_padrao.salario_final) + '.');

			$("#resultado_ade_padrao").show();
		}
		if(qtd_anos >= 20) {
			var adis_satisfatorias = resultado_calculo_padrao.adis_satisfatorias;
			var total_adis = resultado_calculo_padrao.total_adis;
			var resultado_calculo_aposentadoria = calculateADEToRent(adis, salario_posto_grad, qtd_anos, adis_satisfatorias, total_adis);
			var aumento_ade_aposentadoria = (salario_posto_grad*resultado_calculo_aposentadoria.ade_aposentadoria)/100;

			if(qtd_anos == 30) {
				if($("#resultado_ade_padrao").is(':visible'))
					$("#resultado_ade_padrao").hide();
			}

			$("#qtd_adis_aposentadoria").html(adis_satisfatorias + '.');
			$("#ade_aposentadoria").html(resultado_calculo_aposentadoria.ade_aposentadoria.toFixed(2) + '%.');
			$("#salario_inicial_aposentadoria").html('R$' + convertToReal(salario_posto_grad) + '.');
			$("#aumento_ade_aposentadoria").html('R$' + convertToReal(aumento_ade_aposentadoria) + '.');
			$("#salario_aposentadoria").html('R$' + convertToReal(resultado_calculo_aposentadoria.salario_final) + '.');
			$("#resultado_ade_aposentadoria").show();
		}
	});
});

function verifyFields(qtd_anos, data) {
	if(isNaN(qtd_anos) || qtd_anos < 3 || qtd_anos > 30) {
		alert("Quantidade de anos incorreta! Valor deve ser entre 3 e 30 anos.");
		return false;
	}
	if(data == "") {
		alert("Data inválida!")
		return false;
	}
	return true;
}

function createSelect() {
	var select = $("<select id=\"postos_graduacoes\" class=\"selectpicker\" />");
	hierarquia.forEach(function(hierarquico) {
		var optgroup = $("<optgroup />", {label: hierarquico.denominacao});
		hierarquico.integrantes.forEach(function(integrante) {
			$("<option />", {text: integrante}).appendTo(optgroup);
		});
		optgroup.appendTo(select);
	});
	select.appendTo("#postos_graduacoes");
}

function getCurrentDate() {
	var data_atual = new Date();
	var data_correta = "";

	data_correta = data_atual.getFullYear() + "-";
	if(data_atual.getMonth()+1 < 10)
		data_correta += "0";
	data_correta += (data_atual.getMonth()+1) + "-";
	if(data_atual.getDate() < 10)
		data_correta += "0";
	data_correta += data_atual.getDate();
	return data_correta;
}

function organizeADIStructure(qtd_anos, data, adis) {
	for(var i = 1; i <= qtd_anos; i++) {
		adi_tmp = {id: 'adi_' + i, value: 0};
		adis.push(adi_tmp);
	}
	createTitleDiv();
	createDataInputs(0, qtd_anos, data);
	createCalculateDiv();
}

function createTitleDiv() {
	var rowDiv = $("<div class=\"row\" />)");
	var insideDiv = $("<div class=\"col-xs-12\" />)");
	var title = $("<h1>ADIs Anteriores</h1>");
	title.appendTo(insideDiv);
	insideDiv.appendTo(rowDiv);
	rowDiv.appendTo("#dados_adis");
}

function createDataInputs(val_inicial, val_final, data) {
	for(var i = val_inicial; i < val_final; i++) {
		var rowDiv = $("<div class=\"row\" id=\"div_adi_" + (i+1) + "\"/>)");
		var insideDiv = $("<div class=\"col-xs-12\" />)");
		var text = (i+1) + 'º) ' + calculateDate(data, i+1) + ':';
		var dateDiv = $("<div class=\"col-xs-7\"><p style=\"text-align: right\">" + text + "</p></div>");
		var select = $("<select id=\"adi_" + (i+1) + "\" class=\"selectpicker\" />");
		porcentagens_adi.forEach(function(porcentagem_adi) {
			$("<option />", {text: porcentagem_adi.texto, value: porcentagem_adi.valor}).appendTo(select);
		});
		dateDiv.appendTo(insideDiv);
		select.appendTo(insideDiv);
		insideDiv.appendTo(rowDiv);
		rowDiv.appendTo("#dados_adis");
	}
}

function createCalculateDiv() {
	var rowDiv = $("<div class=\"row\" id=\"btn_calcular_ade\"/>)");
	var insideDiv = $("<div class=\"col-xs-12\" />)");
	var button = $("<center><button type=\"button\" class=\"btn btn-danger\" id=\"calcular_ade\" disabled>Calcular ADE</button></center>");
	button.appendTo(insideDiv);
	insideDiv.appendTo(rowDiv);
	rowDiv.appendTo("#dados_adis");
}

function calculateDate(data_entrada, qtd_anos) {
	var dia, mes, ano, novo_dia, novo_mes;
	dia = parseInt(data_entrada.split('-')[2]);
	mes = parseInt(data_entrada.split('-')[1]);
	ano = parseInt(data_entrada.split('-')[0]);

	var data = new Date(Date.UTC(ano+qtd_anos-1, mes-1, dia, 12, 0));
	novaData = new Date(Date.UTC(ano+qtd_anos, mes-1, dia-1, 12, 0));
	dia = data.getDate();
	mes = data.getMonth() + 1;
	novo_dia = novaData.getDate();
	novo_mes = novaData.getMonth() + 1;

	if(dia < 10)
		dia = '0' + dia;
	if(novo_dia < 10)
		novo_dia = '0' + novo_dia;
	if(mes < 10)
		mes = '0' + mes;
	if(novo_mes < 10)
		novo_mes = '0' + novo_mes;

	return dia + '/' + mes + '/' + data.getFullYear() + " à " + novo_dia + '/' + novo_mes + '/' + novaData.getFullYear();
}

function calculateSalary(posto_graducao) {
	var salario;
	$.grep(salarios, function(sal) {
		if(sal.posto_grad === posto_graducao) {
			salario = sal.salario;
			return;
		}
	});
	return salario;
}

function calculateADE(adis, salario_posto_grad, qtd_anos) {
	var adis_satisfatorias = 0;
	var ultima_adi_satisfatoria = 0;
	var ade, ade_obtida, salario_final;
	var total_adis = 0;
	var adi_corrente;

	for(var i = 0; i < qtd_anos; i++) {
		adi_corrente = adis[i];
		if(adi_corrente.value >= 70) {
			adis_satisfatorias++;
			total_adis += adi_corrente.value;
			ultima_adi_satisfatoria = adi_corrente.value;
		}
	}

	if(adis_satisfatorias < 3) {
		ade = ADE_MENOS_TRES_ADIS;
	} else if(adis_satisfatorias < 5) {
		ade = ADE_TRES_ADIS;
	} else if(adis_satisfatorias < 10) {
		ade = ADE_CINCO_ADIS;
	} else if(adis_satisfatorias < 15) {
		ade = ADE_DEZ_ADIS;
	} else if(adis_satisfatorias < 20) {
		ade = ADE_QUINZE_ADIS;
	} else if(adis_satisfatorias < 25) {
		ade = ADE_VINTE_ADIS;
	} else if(adis_satisfatorias < 30) {
		ade = ADE_VINTE_CINCO_ADIS;
	} else if(adis_satisfatorias == 30) {
		ade = ADE_TRINTA_ADIS;
	}
	ade_obtida = ade * ultima_adi_satisfatoria;
	salario_final = (salario_posto_grad + salario_posto_grad * (ade_obtida/100));

	return {adis_satisfatorias: adis_satisfatorias,
			ade: ade,
			ade_obtida: ade_obtida,
			salario_final: salario_final,
			total_adis: total_adis};
}

function calculateADEToRent(adis, salario_posto_grad, qtd_anos, adis_satisfatorias, total_adis) {
	var porcentagem = 0;
	var ade_aposentadoria = 0;
	var salario_final = salario_posto_grad;
	var resultado_calculo_corrente;
	if(adis_satisfatorias > 25) {
		$.grep(adis_aposentadoria, function(adi_aposentadoria) {
			if(adi_aposentadoria.qtd_adis_sat === adis_satisfatorias) {
				porcentagem = adi_aposentadoria.porcentagem;
				return;
			}
		});
		ade_aposentadoria = (porcentagem/100) * (total_adis/adis_satisfatorias);
	} else {
		resultado_calculo_corrente = calculateADE(adis, salario_posto_grad, qtd_anos);
		porcentagem += resultado_calculo_corrente.ade_obtida;
		resultado_calculo_corrente = calculateADE(adis, salario_posto_grad, qtd_anos-1);
		porcentagem += resultado_calculo_corrente.ade_obtida;
		resultado_calculo_corrente = calculateADE(adis, salario_posto_grad, qtd_anos-2);
		porcentagem += resultado_calculo_corrente.ade_obtida;
		resultado_calculo_corrente = calculateADE(adis, salario_posto_grad, qtd_anos-3);
		porcentagem += resultado_calculo_corrente.ade_obtida;
		resultado_calculo_corrente = calculateADE(adis, salario_posto_grad, qtd_anos-4);
		porcentagem += resultado_calculo_corrente.ade_obtida;
		ade_aposentadoria = (porcentagem/5);
	}
	salario_final = salario_posto_grad*(1+(ade_aposentadoria/100));

	return {ade_aposentadoria: ade_aposentadoria,
			salario_final: salario_final};
}

function clearData() {
	if($("#dados_adis").is(':visible')) {
		$("#dados_adis").empty();
	}
	$("#dados_adis").hide();
	$("#resultado_ade").hide();
}

function removeDataInputs(antiga_qtd_anos, qtd_anos, adis) {
	$("#btn_calcular_ade").remove();

	if(antiga_qtd_anos >= 20 && qtd_anos < 20 && $("#resultado_ade_aposentadoria").is(':visible'))
		$("#resultado_ade_aposentadoria").hide();

	for(var i = antiga_qtd_anos-1; i >= qtd_anos; i--) {
		adis.splice(i, 1);
		$("#div_adi_" + (i+1)).remove();
	}
	createCalculateDiv();
}

function addDataInputs(antiga_qtd_anos, qtd_anos, data, adis) {
	$("#btn_calcular_ade").remove();
	for(var i = antiga_qtd_anos+1; i <= qtd_anos; i++) {
		adi_tmp = {id: 'adi_' + i, value: 0};
		adis.push(adi_tmp);
	}
	createDataInputs(antiga_qtd_anos, qtd_anos, data);
	createCalculateDiv();
}

function convertToReal(number) {
	var tmp = number.toFixed(2).replace(/\./g, ',');
	var num = tmp.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
	return num;
}
