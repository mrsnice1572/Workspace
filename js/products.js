const ORDER_ASC_BY_COST = "AscCost";
const ORDER_DESC_BY_COST = "DescCost";
const ORDER_BY_PROD_SOLDCOUNT = "SoldCount";
var ProductArray = []; /* define una lista vacia*/
var currentProductArray = [];
var currentSortCriteria = undefined;
var minSoldCount = undefined;
var maxSoldCount = undefined;

function sortProduct(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_SOLDCOUNT){
        result = array.sort(function(a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if ( aSoldCount > bSoldCount ){ return -1; }
            if ( aSoldCount < bSoldCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showProductList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductArray.length; i++){
        let product = currentProductArray[i];

        if (((minSoldCount == undefined) || (minSoldCount != undefined && parseInt(product.soldCount) >= minSoldCount)) &&
           ((maxSoldCount == undefined) || (maxSoldCount != undefined && parseInt(product.soldCount) <= maxSoldCount))){

            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="" class="img-thumbnail">
                        
                    </div>
    
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name +`</h4>
                            
                            <small class="text-muted">` + product.cost + ` USD</small>
                        </div>
                        <p> `+ product.description +`</p>
                    </div>
                </div>
            </div>
            `

           }

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend; 
    }
}


function sortAndShowProduct(sortCriteria, productArray){
    currentSortCriteria = sortCriteria;

    if(productArray != undefined){
        currentProductArray = productArray;
    }

    currentProductArray = sortProduct(currentSortCriteria, currentProductArray);

    //Muestro los productos ordenados
    showProductList();
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){  /*lo tengo que procesar con un then porque lo que me devuleve un then es una promisse que se tiene que trabajar dentro de un then. Nunca salgo de la cadena de then . Se nombra el paquete que se recibe con una funcion anomima*/
        if (resultObj.status === "ok") /* se consulta si el estatus está ok*/
        {
            sortAndShowProduct(ORDER_ASC_BY_COST, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProduct(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProduct(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortBySoldCount").addEventListener("click", function(){
        sortAndShowProduct(ORDER_BY_PROD_SOLDCOUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterSoldCountMin").value = "";
        document.getElementById("rangeFilterSoldCountMax").value = "";

        minSoldCount = undefined;
        maxSoldCount = undefined;

        showProductList();
    });

    document.getElementById("rangeFilterSoldCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por el costo
        //de los productos.
        minSoldCount = document.getElementById("rangeFilterSoldCountMin").value;
        maxSoldCount = document.getElementById("rangeFilterSoldCountMax").value;

        if ((minSoldCount != undefined) && (minSoldCount != "") && (parseInt(minSoldCount)) >= 0){
            minSoldCount = parseInt(minSoldCount);
        }
        else{
            minSoldCount = undefined;
        }

        if ((maxSoldCount != undefined) && (maxSoldCount != "") && (parseInt(maxSoldCount)) >= 0){
            maxSoldCount = parseInt(maxSoldCount);
        }
        else{
            maxSoldCount = undefined;
        }

        showProductList();
    });
});