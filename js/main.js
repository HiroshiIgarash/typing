
//お題
const TIMEBONUS_COMBO=30; //ボーナスを得るためのコンボ数
const TIMEBONUS_TIME=15; //ボーナスタイム
const START_TIME=20; //スタート時のタイム
const GAMEOVER_MISS=50; //ゲームオーバーになるミス数
let theme=data[0].eigo //打つべき文字
let strNum=0; //現在の文字場所
let audioCorrect=new Audio("correct.mp3") //タイピング音
let audioMiss=new Audio("miss.mp3") //ミス音
let audioBonus=new Audio("timeBonus.mp3")
let combo=0; //現在のコンボ
let MaxCombo=0; //Maxコンボ
let score=0; //スコア
let type=0; //タイプ数
let miss=0; //ミス数
let time=START_TIME; //残り時間
let gameover=true;
let timer=null;


$(".result").hide();

//変数の初期化
function init(){
    combo=0;
    MaxCombo=0;
    score=0;
    type=0;
    miss=0;
    time=START_TIME;

    $("#Combo").html(combo);
    $("#MaxCombo").html(MaxCombo);
    $("#Score").html(score);
    $("#Miss").html(miss);
    $("#Type").html(type);
    $("#Timer").html(time);
    $(".bar").css("width",time*6+"px")
    $(".scorebar").css("width",0)
}

//お題をspanで囲みセットする
function createSpan(){
    //文字ごとに分解
    arrTheme=theme.split("")

    //#themeを空に
    $("#theme").empty();
    
    //spanで囲んであげる
    arrTheme.forEach(spell => {
        $("#theme").append(`<span>${spell}</span>`);
    });
}

//文字を打った時
$("#nyuryoku").on("input",()=>{
    //打ち込んだ文字
    val=$("#nyuryoku").val();

    //menu画面の時
    if(gameover){
        //Shift + X でゲーム開始
        if(val=="X"){
            gameover=false;
            init();
            $(".menu").hide();
            $(".result").hide();
            themeset();
            timer=setInterval(()=>{
                time--;
                $("#Timer").html(time);
                $(".bar").css("width",time*6+"px")
                if(time<1){
                    clearInterval(timer);
                    gameover=true;
                    $(".result .score").html(score);
                    $(".result .type").html(type);
                    $(".result .maxCombo").html(MaxCombo);
                    $(".result .miss").html(miss);
                    $(".result .missper").html((type==0?0:Math.floor(miss/type*10000)/100)+" %");
                    $(".result .result-rank").html(rank(score));

                    $(".result").show();
                }
            },1000)     
        }

    //ゲーム中
    }else{

    type++
    $("#Type").html(type)

    //あっている場合
    if(theme[strNum]==val){
        //combo+
        combo++
        MaxCombo=Math.max(combo,MaxCombo)
        $("#Combo").html(combo)
        $("#MaxCombo").html(MaxCombo)

        //comboがTIMEBONUS_COMBOの倍数で時間延長
        if(combo>0&&combo%TIMEBONUS_COMBO==0){
            time+=TIMEBONUS_TIME;
            showmessage(`+${TIMEBONUS_TIME}s`,"green","0","500px")
            audioBonus.currentTime=0;
            audioBonus.play();
        }
        
        //score
        score+=Math.floor((1.02**combo))*10
        $("#Score").html(score)
        $(".scorebar").css("width",score/1000000*85+"%")
        
        //赤字で獲得スコア表示
        showmessage("+"+Math.floor((1.02**combo))*10,"red")
        
        //効果音
        audioCorrect.currentTime=0;
        audioCorrect.play();
        
        //correctクラスの追加
        $(`#theme span:nth-child(${strNum+1})`).addClass("correct");
        strNum++;
        addUnder();
        
        if(strNum==theme.length){
            themeset();
        }
    }else{
        //効果音
        audioMiss.currentTime=0;
        audioMiss.play();
        
        //青字でミス
        showmessage("Miss","blue");
        
        
        miss++
        $("#Miss").html(miss)
        combo=0;
        $("#Combo").html(combo)

        if(miss>=GAMEOVER_MISS){
            clearInterval(timer);
            gameover=true;
            $(".result .score").html(score);
            $(".result .type").html(type);
            $(".result .maxCombo").html(MaxCombo);
            $(".result .miss").html(miss);
            $(".result .missper").html((type==0?0:Math.floor(miss/type*10000)/100)+" %");
            $(".result .result-rank").html(rank(score));

            $(".result").show();
        }
    }
    
}
    $("#nyuryoku").val("");
})

//お題を変える
function themeset(){
    rand=Math.floor(Math.random()*data.length);
    $("#ja").html(data[rand].kana)
    theme=data[rand].eigo;
    createSpan();
    strNum=0;
    addUnder();
}

//下線をひく
function addUnder(){
    $("#theme span").removeClass("under");
    $(`#theme span:nth-child(${strNum+1})`).addClass("under");
}

//得点・Missなどのメッセージを表示する
function showmessage(message,color,top="80px",right="150px"){
    $(".game-box").append(`<div class="scorePlus" style="color:${color};top:${top};right:${right}">${message}</div>`)
    
    $(".scorePlus").animate({top:"-100px",opacity:0},1000,"linear",()=>{
        $(".scorePlus:first").remove();
    });
}

function rank(scr){
    switch(true){
        case scr>24340000:{
            return "2434ランク"
        }
        case scr>1000000:{
            return "SSSランク";
        }
        case scr>800000:{
            return "SSランク";
        }
        case scr>400000:{
            return "Sランク";
        }
        case scr>100000:{
            return "Aランク";
        }
        case scr>30000:{
            return "Bランク";
        }
        case scr>10000:{
            return "Cランク";
        }
        default :{
            return "Dランク"
        }
    }
}


//フォーカスを固定する
$("#nyuryoku").on("blur",()=>{
    $("#nyuryoku").focus();
})

