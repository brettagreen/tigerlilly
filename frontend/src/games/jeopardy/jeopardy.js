import $ from 'jquery';
import axios from  'axios';
import { useEffect } from 'react';

function Jeopardy() {

    const baseAPI = 'http://cluebase.lukelav.in/'
    const NUM_CATEGORIES = 6;
    const NUM_QUESTIONS = 5;
    const gameCategories = [];
    const spinnerURL = 'https://gifimage.net/wp-content/uploads/2018/05/spinner-gif-transparent-background-5.gif';

    useEffect(() => {
        //on load
        showLoadingView();
    }, [])

    /** Get NUM_CATEGORIES random category from API.
     *
     */

    async function getCategoryIds() {
        let data;
        const allCategories = [];
        let offset = 0; //can only return 2k categories at a time, so use incrementing offset/pagination
        const LIMIT_SIZE = 2000;

        while (offset < 6000) {
            const response = await axios.get(baseAPI+'/categories', {params: {'limit': LIMIT_SIZE, 'offset': offset }});
            offset+=LIMIT_SIZE;
            data = response.data;

            for (let x = 0; x < LIMIT_SIZE; x++) {
                allCategories.push(data.data[x]);
            }
        }

        let count = 0;
        //randomly chose six categories
        while (count < NUM_CATEGORIES) {
            gameCategories[count] = allCategories[Math.floor(Math.random() * allCategories.length)];
            count++;
        }
    }


    /** Return object with data about a category:
     */

    //returns map with category key and array of category answers.

    async function getCategory() {
        const categoryMap = new Map();
        for (const idx in gameCategories) {
            const category = (gameCategories[idx].category).toLowerCase();
            const response = await axios.get(baseAPI+'/clues/random', {params: {'category': category, 'limit': NUM_QUESTIONS}});
            categoryMap.set(category, response.data);
        }
        return categoryMap;
    }



    /** Fill the HTML table#jeopardy with the categories & cells for questions.
     *
     * - The <thead> should be filled w/a <tr>, and a <td> for each category
     * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
     *   each with a question for each category in a <td>
     *   (initally, just show a "?" where the question/answer would go.)
     */

    function fillTable(categoryMap) {
        const table = $('<table>');
        table.attr('id', 'jeopardyTable');
        const tHead = $('<thead>');
        tHead.attr('id', 'jeopardTHead');
        const tBody = $('<tbody>');
        tBody.attr('id', 'jeopardyTBody');
        table.append(tHead);
        const catRow = $('<tr>');
        tHead.append(catRow);

        //populate categories row
        for (let category of categoryMap.keys()) {
            let td = $('<td>');
            td.attr('class', 'jeopCategory')
            td.text(category);
            catRow.append(td);
        }
        
        table.append(tBody);

        //create trs for 'clues/answers' rows
        const trs = [];
        for (let y = 0; y < NUM_QUESTIONS; y++) {
            const tr = $('<tr>');
            trs.push(tr);
            tBody.append(tr);
        }

        //create and populate 'clues/answers' tds. append to respective tr.
        for (let value of categoryMap.values()) {
            for (let x = 0; x < value.data.length; x++) {
                const td = $('<td>');
                td.attr('class', 'jeopAnswer');
                td.text('?');
                td.attr('data-clue', value.data[x].clue);
                td.attr('data-category', value.data[x].category);
                td.attr('data-answer', value.data[x].response);
                td.addClass('new');
                trs[x].append(td);
            }
        }

        //remove spinner upon table load
        if ($('#jeopardyFrame').has('#jeopardySpinner')) {
            $('#jeopardySpinner').remove();
        }

        //append table and event handlers, do styling
        $('#jeopardyFrame').append(table);

        $('.jeopCategory, .jeopAnswer').css('width', '80px').css('height', '80px').css('border', 'solid 1px #666').css('text-align', 'center').css(
            'color', 'white').css('background-color', 'rgba(6,12,233,.7)').css('cursor', 'pointer');
        $('#jeopardyFrame').append('<button id="jeopardyButton">New Game</button>');
        $('#jeopardyFrame').css('background-color', '#115ff4');
        $('#jeopardyTable').css({"position": "absolute", "margin-top":"5%", "left": "0", "right": "0", "margin-left": "17%",
            "margin-right": "15%", "width": "65%"});

        $('#jeopardyTBody td').on('click', handleClick);
        $('#jeopardyButton').on('click', handleClick);
    }

    /** Handle clicking on a clue: show the question or answer.
     *
     * Uses .showing property on clue to determine what to show:
     * - if currently null, show question & set .showing to "question"
     * - if currently "question", show answer & set .showing to "answer"
     * - if currently "answer", ignore click
     * */

    function handleClick(evt) {

        if ($(this).hasClass('new')) {
            $(this).removeClass('new').addClass('question');
            $(this).text($(this).attr('data-clue'));
        } else if ($(this).hasClass('question')) {
            $(this).removeClass('question').addClass('answer');
            $(this).text($(this).attr('data-answer'));
        } else if (evt.target.tagName === 'BUTTON') {
            showLoadingView();
        }
    }


    //runs at start and upon user choosing another game
    //define spinner object and set css/
    //clean up DOM and call REST functions

    async function showLoadingView() {
        const spinner = $(`<img src="${spinnerURL}" alt="spinner">`);
        spinner.attr('id', 'jeopardySpinner');
        spinner.css({"position": "absolute", "margin-top":"20%", "left": "0", "right": "0", "margin-left": "40%",
        "margin-right": "40%"});

        if ($('#jeopardyFrame').has('#jeopardyTable')) {
            $('#jeopardyTable').remove();
        }

        if ($('#jeopardyFrame').has('#jeopardyButton')) {
            $('#jeopardyButton').remove();
        }

        $('#jeopardyFrame').append(spinner);
        await getCategoryIds();
        const categoryMap = await getCategory();
        fillTable(categoryMap);
    }

    return(
        <>
            <h3>JEOPARDY!</h3>
            <div id="jeopardyFrame">

            </div>
        </>
    )

}

export default Jeopardy;
