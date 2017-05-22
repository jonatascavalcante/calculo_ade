//Vencimentos de todos os postos e graduações da corporação
const SAL_CEL = 15776.35;
const SAL_TEN_CEL = 14230.21;
const SAL_MAJ = 12684.09;
const SAL_CAP =  11740.99;
const SAL_1_TEN = 10445.50;
const SAL_2_TEN = 8874.59;
const SAL_ASP_OF = 7971.84;
const SAL_CAD_UA = 7104.80;
const SAL_CAD_DA = 5769.43;
const SAL_SUBTEN = 7971.84;
const SAL_1_SGT = 7104.80;
const SAL_2_SGT = 6202.04;
const SAL_3_SGT = 5472.68;
const SAL_CB = 4743.34;
const SAL_SD_1_CL = 4098.41;
const SAL_SD_2_CL = 3506.40;

//ADEs relativos a quantidade de ADIs satisfatórios
const ADE_MENOS_TRES_ADIS = 0.0;
const ADE_TRES_ADIS = 0.06;
const ADE_CINCO_ADIS = 0.1;
const ADE_DEZ_ADIS = 0.2;
const ADE_QUINZE_ADIS = 0.3;
const ADE_VINTE_ADIS = 0.4;
const ADE_VINTE_CINCO_ADIS = 0.5;
const ADE_TRINTA_ADIS = 0.6;

//Relação entre a denominação do militar e os repectivos postos/graduações
const hierarquia = [{denominacao: "Oficiais Superiores", integrantes: ["Coronel BM", "Tenente-coronel BM", "Major BM"]},
		   {denominacao: "Oficial Intermediário", integrantes: ["Capitão BM"]}, 
		   {denominacao: "Oficiais Subalternos", integrantes: ["1º Tenente BM", "2º Tenente BM"]}, 
		   {denominacao: "Praças Especiais", integrantes: ["Aspirante a Oficial BM", "Cadete III BM", "Cadete II BM", "Cadete I BM"]},
		   {denominacao: "Praças", integrantes: ["Subtenente BM", "1º Sargento BM", "2º Sargento BM", 
		   "3º Sargento BM", "Cabo BM", "Soldado 1ª Classe BM", "Soldado 2ª Classe BM"]}];

//Relação do posto/graduação e salário respectivamente
const salarios = [{posto_grad: "Coronel BM", salario: SAL_CEL},
				  {posto_grad: "Tenente-coronel BM", salario: SAL_TEN_CEL},
				  {posto_grad: "Major BM", salario: SAL_MAJ},
				  {posto_grad: "Capitão BM", salario: SAL_CAP},
				  {posto_grad: "1º Tenente BM", salario: SAL_1_TEN},
				  {posto_grad: "2º Tenente BM", salario: SAL_2_TEN},
				  {posto_grad: "Aspirante a Oficial BM", salario: SAL_ASP_OF},
				  {posto_grad: "Cadete III BM", salario: SAL_CAD_UA},
				  {posto_grad: "Cadete II BM", salario: SAL_CAD_DA},
				  {posto_grad: "Cadete I BM", salario: SAL_CAD_DA},
				  {posto_grad: "Subtenente BM", salario: SAL_SUBTEN},
				  {posto_grad: "1º Sargento BM", salario: SAL_1_SGT},
				  {posto_grad: "2º Sargento BM", salario: SAL_2_SGT},
				  {posto_grad: "3º Sargento BM", salario: SAL_3_SGT},
				  {posto_grad: "Cabo BM", salario: SAL_CB},
				  {posto_grad: "Soldado 1ª Classe BM", salario: SAL_SD_1_CL},
				  {posto_grad: "Soldado 2ª Classe BM", salario: SAL_SD_2_CL}];

//Relação da porcentagem referente à quantidade de adis satisfatórios para aposentadoria
const adis_aposentadoria = [{qtd_adis_sat: 30, porcentagem: 70},
							{qtd_adis_sat: 29, porcentagem: 66},
							{qtd_adis_sat: 28, porcentagem: 62},
							{qtd_adis_sat: 27, porcentagem: 58},
							{qtd_adis_sat: 26, porcentagem: 54}];

//Relação das porecentagens dos ADIS
const porcentagens_adi = [{texto: "---", valor:-1},
						 {texto: "100%", valor: 100},
						 {texto: "95%", valor: 95},
						 {texto: "90%", valor: 90},
						 {texto: "85%", valor: 85},
						 {texto: "80%", valor: 80},
						 {texto: "75%", valor: 75},
						 {texto: "70%", valor: 70},
						 {texto: "menor que 70%", valor: 60}];
						 