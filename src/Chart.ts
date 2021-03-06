﻿module Fayde.DataVis {
    import Control = Controls.Control;

    export interface IChartInfo {
    }

    export class Chart extends Control {
        static SeriesProperty = DependencyProperty.RegisterImmutable<SeriesCollection>("Series", () => SeriesCollection, Chart);
        Series: SeriesCollection;

        private _Presenter: ChartPresenter = null;
        private _ChartInfo: IChartInfo = {};
        get ChartInfo (): IChartInfo {
            return this._ChartInfo;
        }

        private _SeriesListener: Internal.ICollectionListener = null;

        constructor () {
            super();
            this.DefaultStyleKey = Chart;
            var series = Chart.SeriesProperty.Initialize(this);
            series.AttachTo(this);
            this._SeriesListener = series.Listen((series, index) => series.Attach(this), (series, index) => series.Detach());
        }

        OnApplyTemplate () {
            super.OnApplyTemplate();

            if (this._Presenter)
                this._Presenter.Detach();
            this._Presenter = <ChartPresenter>this.GetTemplateChild("Presenter", ChartPresenter);
            if (this._Presenter)
                this._Presenter.Attach(this);
        }
    }
    Markup.Content(Chart, Chart.SeriesProperty);
    Controls.TemplateParts(Chart,
        {Name: "Presenter", Type: ChartPresenter});
}