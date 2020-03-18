$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })

    var table = $('#myTable').DataTable({
        "bScrollCollapse": true,
        "order": [2, 'desc'],
        "searching": true,
        searchPanes: {
            className: 'myCustomClass',
            threshold: 1,
            layout: 'columns-2',
            clear: false,
            nameButton: false,
            columns: [1, 2]
        },
        dom: 'Pfrtip',
        columnDefs: [{
            searchPanes: {
                controls: false,
                hideCount: true,
                header: '포지션',
                options: [{
                    label: "탱커",
                        value: function (rowData, rowIdx) {
                        return rowData['position'] === "탱커";}}, {
                    label: "원거리딜러",
                        value: function (rowData, rowIdx) {
                        return rowData['position'] === "원거리딜러";}}, {
                    label: "근거리딜러",
                        value: function (rowData, rowIdx) {
                        return rowData['position'] === "근거리딜러";
                            }
                        }, {
                    label: "서포터",
                        value: function (rowData, rowIdx) {
                        return rowData['position'] === "서포터";
                            }
                        }
                    ]
                },
                targets: [1]
            }, {
                searchPanes: {
                    controls: false,
                    hideCount: true,
                    header: '픽률',
                    options: [
                        {
                            label: "5% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 5;
                            }
                        }, {
                            label: "10% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 10;
                            }
                        }, {
                            label: "15% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 15;
                            }
                        }, {
                            label: "20% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 20;
                            }
                        }
                    ]
                },
                targets: [2]
            },
            
        ],

        "ajax": {
            'url': 'public/json/positionInfo.json',
            'dataSrc': ''
        },
        "columns": [
            {
                "data": "charID",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><a href="/character/' + data + '/' + row['position'] +
                                ' "><img src="/public/thumb/' + data + '.jpg" class="img-thumbnail"></a></p>';
                    }
                    return data;
                }
            }, {
                "data": "position",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><img src="/public/attriImg/' + data +
                                '.jpg"></p>';
                    }
                    return data;
                }
            }, {
                "data": "pickRate",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data ='<p class="text-center"><strong>' + data + '%</strong><br><em>'+row['pick']+'</em></p>'                     
                    }
                    return data;
                }
            }, {
                "data": "winRate",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '%</strong></p>';
                    }
                    return data;
                }
            }
        ],
        "language": {
            "emptyTable": "데이터가 없어요.",
            "lengthMenu": "페이지당 _MENU_ 개씩 보기",
            "info": "현재 _START_ - _END_ / _TOTAL_건",
            "infoEmpty": "사이퍼 없음",
            "infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
            "zeroRecords": "이런 사이퍼는 없어요...",
            "loadingRecords": "로딩중...",
            "processing": "잠시만 기다려 주세요...",
            "searchPanes": { title: {_: ''} },
            "paginate": {"next": "다음","previous": "이전"}}
    });

    var s_table = $('#statisticTable').DataTable({
        "order": [
            [2, 'desc']
        ],
        "searching": true,
        searchPanes: {
            threshold: 1,
            layout: 'columns-3',
            clear: false,
            nameButton: false,
            columns: [1, 2,3]
        },
        dom: 'Pfrtip',

        columnDefs: [
            {
                searchPanes: {
                    controls: false,
                    hideCount: true,
                    header: '포지션',
                    options: [
                        {
                            label: "탱커",
                            value: function (rowData, rowIdx) {
                                return rowData['position'] === "탱커";
                            }
                        }, {
                            label: "원거리딜러",
                            value: function (rowData, rowIdx) {
                                return rowData['position'] === "원거리딜러";
                            }
                        }, {
                            label: "근거리딜러",
                            value: function (rowData, rowIdx) {
                                return rowData['position'] === "근거리딜러";
                            }
                        }, {
                            label: "서포터",
                            value: function (rowData, rowIdx) {
                                return rowData['position'] === "서포터";
                            }
                        }
                    ]
                },
                targets: [1]
            }, {
                searchPanes: {
                    controls: false,
                    hideCount: true,
                    header: '픽률',
                    options: [
                        {
                            label: "5% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 5;
                            }
                        }, {
                            label: "10% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 10;
                            }
                        }, {
                            label: "15% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 15;
                            }
                        }, {
                            label: "20% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['pickRate'] >= 20;
                            }
                        }
                    ]
                },
                targets: [2]
            },{
                searchPanes: {
                    controls: false,
                    hideCount: true,
                    header: '승률',
                    options: [
                        {
                            label: "40% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['winRate'] >= 40;
                            }
                        }, {
                            label: "45% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['winRate'] >= 45;
                            }
                        }, {
                            label: "50% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['winRate'] >= 50;
                            }
                        }, {
                            label: "55% 이상",
                            value: function (rowData, rowIdx) {
                                return rowData['winRate'] >= 55;
                            }
                        }
                    ]
                },
                targets: [3]
            }
        ],

        "ajax": {
            'url': 'public/json/positionInfo.json',
            'dataSrc': ''
        },
        "columns": [
            {
                "data": "charID",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><a href="/character/' + data + '/' + row['position'] +
                                ' "><img src="/public/thumb/' + data + '.jpg" class="img-thumbnail"></a></p>';
                    }
                    return data;
                }
            }, {
                "data": "position",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><img src="/public/attriImg/' + data +
                                '.jpg"></p>';
                    }
                    return data;
                }
            }, {
                "data": "pick",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '판</strong></p>';
                    }
                    return data;
                }
            }, {
                "data": "pickRate",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '%</strong></p>';
                    }
                    return data;
                }
            }, {
                "data": "winRate",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '%</strong></p>';
                    }
                    return data;
                }
            }, {
                "data": "meanKDA",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '</strong></p>';
                    }
                    return data;
                }
            }, {
                "data": "meanAttackPoint",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '</strong></p>';
                    }
                    return data;
                }
            }, {
                "data": "meanDamagePoint",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '</strong></p>';
                    }
                    return data;
                }
            }, {
                "data": "meanBattlePoint",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '점</strong></p>';
                    }
                    return data;
                }
            }, {
                "data": "meanSightPoint",
                "render": function (data, type, row) {
                    if (type == 'display') {
                        data = '<p class="text-center"><strong>' + data + '점</strong></p>';
                    }
                    return data;
                }
            }
        ],
        "language": {
            "emptyTable": "데이터가 없어요.",
            "lengthMenu": "페이지당 _MENU_ 개씩 보기",
            "info": "현재 _START_ - _END_ / _TOTAL_건",
            "infoEmpty": "사이퍼 없음",
            "infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
            "zeroRecords": "이런 사이퍼는 없어요...",
            "loadingRecords": "로딩중...",
            "processing": "잠시만 기다려 주세요...",
            searchPanes: {
                title: {
                    _: ''
                }
            },
            "paginate": {
                "next": "다음",
                "previous": "이전"
            }
        }
    });

});
