(function() {
    'use strict';

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');

            if (pair[0] === variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
            }
        }
    }

    var searchTerm = getQueryVariable('q');

    function initSearch() {
        if (typeof elasticlunr === 'undefined') {
            console.error('Elasticlunr not found. Please make sure elasticlunr.min.js is loaded.');
            return;
        }

        var index = elasticlunr.Index.load(window.searchIndex);

        var searchInput = document.getElementById('search-input');
        var searchResults = document.getElementById('search-results');

        if (searchTerm) {
            document.getElementById('search_modal').showModal();
            searchInput.value = searchTerm;
        }

        function doSearch() {
            var query = searchInput.value;
            if (!query) {
                searchResults.innerHTML = '';
                return;
            }
            
            // Add wildcard for prefix search
            var results = index.search(query + '*', { expand: true });

            searchResults.innerHTML = '';

            if (results.length === 0) {
                searchResults.innerHTML = '<li>No results found for "' + query + '"</li>';
                return;
            }

            var resultList = '';
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var doc = window.searchIndex.documentStore.docs[result.ref];
                var resultItem =
                    '<li class="py-2 border-b border-base-200">' +
                        '<a href="' + doc.id + '" class="text-lg font-serif hover:text-primary">' + doc.title + '</a>' +
                        '<p class="text-sm text-base-content/70">' + doc.body.substring(0, 150) + '...</p>' +
                    '</li>';
                resultList += resultItem;
            }
            searchResults.innerHTML = resultList;
        }

        searchInput.addEventListener('keyup', doSearch);

        if (searchTerm) {
            doSearch();
        }
    }

    if (window.searchIndex) {
        initSearch();
    } else {
        document.addEventListener('DOMContentLoaded', initSearch);
    }
})();