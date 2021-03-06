﻿module Fayde.DataVis {
    import Canvas = Controls.Canvas;
    export class ChartPresenter extends Canvas {
        Owner: Chart = null;
        private _SeriesListener: Internal.ICollectionListener = null;
        private _SeriesPresenters: SeriesPresenter[] = [];

        get ChartInfo (): IChartInfo {
            return this.Owner ? this.Owner.ChartInfo : null;
        }

        constructor () {
            super();
            this.SizeChanged.on(this.OnSizeChanged, this);
        }

        Detach () {
            if (this._SeriesListener) {
                this._SeriesListener.Unlisten();
                this._SeriesListener = null;
            }

            if (this.Owner) {
                var arr = this.Owner.Series.ToArray();
                for (var arr = this.Owner.Series.ToArray(), i = arr.length - 1; i >= 0; i--) {
                    this._OnSeriesRemoved(arr[i], i);
                }
            }

            this.Owner = null;
        }

        Attach (chart: Chart) {
            this.Owner = chart;
            if (chart) {
                for (var en = chart.Series.getEnumerator(), i = 0; en.moveNext(); i++) {
                    this._OnSeriesAdded(en.current, i);
                }

                this._SeriesListener = chart.Series.Listen((item, index) => this._OnSeriesAdded(item, index), (item, index) => this._OnSeriesRemoved(item, index));
            }
        }

        private _OnSeriesAdded (series: Series, index: number) {
            series.ChartInfo = this.ChartInfo;
            var presenter = series.Presenter;
            this._SeriesPresenters.splice(index, 0, presenter);
            this.Children.Add(presenter);
        }

        private _OnSeriesRemoved (series: Series, index: number) {
            series.ChartInfo = null;
            var presenter = this._SeriesPresenters.splice(index, 1)[0];
            this.Children.Remove(presenter);
        }

        OnSizeChanged (sender: any, e: SizeChangedEventArgs) {
            for (var i = 0, ps = <IPresenter[]>this._SeriesPresenters, len = ps.length; i < len; i++) {
                ps[i].UpdateSize(e.NewSize);
            }
        }
    }
}