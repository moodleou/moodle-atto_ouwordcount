// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_ouwordcount
 * @copyright  2019 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_ouwordcount-button
 */

/**
 * Atto text editor ouwordcount plugin.
 *
 * @namespace M.atto_ouwordcount
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_ouwordcount';

Y.namespace('M.atto_ouwordcount').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * Reference to the word count element
     */
    _wordCount: null,

    initializer: function () {
        if (!this.get('capability')) {
            return;
        }

        var newNode = document.createElement('div');
        newNode.setAttribute('class', 'ou_word_count');

        this._wordCount = document.createElement('span');
        newNode.appendChild(this._wordCount);
        this.editor._node.parentNode.insertBefore(newNode, this.editor._node.nextSibling);
        this._hideWordCount();

        // Update the word count when the text is changed
        this.get('host').textarea.on(['change', 'input', 'paste', 'keyup'], this._updateWordCount, this);
        this.editor.on('focus', this._showWordCount, this);
        this.editor.on('blur', this._hideWordCount, this);
    },

    _updateWordCount: function () {
        var count = this._figureOutWordCount(this.editor._node.textContent);
        this._wordCount.textContent = M.util.get_string('wordcount', COMPONENTNAME) + ' ' +  count;
    },

    _showWordCount: function () {
        this._updateWordCount();
        this._wordCount.parentNode.style.display = 'block';
    },

    _hideWordCount: function () {
        // Add a tiny delay before hiding so that any buttons below the editor have time to register a click before they move
        setTimeout(function () {
            this._wordCount.parentNode.style.display = 'none';
        }.bind(this), 200);
    },

    /**
     * Counts the number of words of the string.
     * Copied from mod_oucontent/dynamic_word_count
     *
     * @param {string} text
     * @returns {number}
     */
    _figureOutWordCount: function (text) {
        var count = 0,
            regex1 = new RegExp('\\</p>|</li>|</span>', 'g'), // Regex for replace all </p>, </li>, </span> to '\n'.
            regex2 = new RegExp('\\<[^>]*>', 'g'), // Regex for replace all html tag to ''.
            actual = text.replace(regex1, '\n')
                .replace(regex2, '')
                .trim()
                .split(/ |\n|&nbsp;/);
        // Remove all empty element in array.
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                count++;
            }
        }
        return count;
    }
},
{
    ATTRS: {
        capability: {
            value: false
        }
    }
});