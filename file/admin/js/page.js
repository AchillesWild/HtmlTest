
    function getPageLink(currentPage, totalPage) {
        let previousPageLink = `<span class="page-link ${(currentPage==1) ? '' : 'disabled'}" data-page="${currentPage - 1}">上一页</span>`;
        if (currentPage == 1) {
              previousPageLink = `<span 'disabled'>上一页</span>`;
          }
        let pageLinks = '';
        if (totalPage <= 5) {
          for (let i = 1; i <= totalPage; i++) {
            let link = `<span class="page-link ${(i === currentPage) ? 'active' : ''}" data-page="${i}">${i}</span>`;
            pageLinks += link;
           }
        } else {
          let start = Math.max(currentPage - 2, 2);
          let end = Math.min(currentPage + 2, totalPage - 1);
          let link1 = `<span class="page-link ${(currentPage === 1) ? 'active' : ''}"  data-page="1">1</span>`;
          let link2 = `<span 'disabled'>...</span>`;
          let link3 = `<span class="page-link ${(currentPage === totalPage) ? 'active' : ''}" data-page="${totalPage}">${totalPage}</span>`;

          pageLinks += link1;
          if (currentPage > 4) { pageLinks += link2; }
          for (let i = start; i <= end; i++) {
            let link = `<span class="page-link ${(i === currentPage) ? 'active' : ''}" data-page="${i}">${i}</span>`;
            pageLinks  +=  link;
          }
          if (currentPage < totalPage - 3) { pageLinks += link2; }
              pageLinks += link3;
        }
        let nextPageLink = `<span class="page-link ${(currentPage < totalPage) ? '' : 'disabled'}" data-page="${currentPage + 1}">下一页</span>` ;
        if (currentPage == totalPage) {
            nextPageLink = `<span 'disabled'>下一页</span>`;
        }
        let pagination = `${previousPageLink}${pageLinks}${nextPageLink}`;
        return pagination;
    }
