import mongoose from "mongoose";

// Sub-schemas
const VideoSchema = new mongoose.Schema(
  {
    type: String,
    key: String,
    site: String,
    name: String,
  },
  { _id: false }
);

const KeywordSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
  },
  { _id: false }
);

const TVSeriesSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true, enum: ["tv"] },
  title: { type: String, required: true },
  originalTitle: String,
  releaseDate: Date,
  status: String, // e.g., "Returning Series"
  overview: String,
  tagline: String,
  runtime: [Number], // Array for TV shows as episodes can have different lengths
  popularity: Number,
  voteAverage: Number,
  voteCount: Number,
  budget: Number,
  revenue: Number,
  posterPath: String,
  backdropPath: String,
  images: {
    posters: [String],
    backdrops: [String],
  },
  videos: [VideoSchema],
  genres: [
    {
      id: Number,
      name: String,
      _id: false,
    },
  ],
  keywords: [KeywordSchema],
  contentRatings: {
    type: Map,
    of: [String], // Maps country code to array of ratings
  },
  alternativeTitles: [
    {
      iso_3166_1: String, // Country code
      title: String,
      type: String,
      _id: false,
    },
  ],
  originalLanguage: String,
  spokenLanguages: [
    {
      english_name: String,
      iso_639_1: String,
      name: String,
      _id: false,
    },
  ],
  productionCompanies: [
    {
      id: Number,
      name: String,
      origin_country: String,
      logo_path: String,
      _id: false,
    },
  ],
  productionCountries: [
    {
      iso_3166_1: String,
      name: String,
      _id: false,
    },
  ],
  credits: {
    cast: [
      {
        id: Number,
        name: String,
        character: String,
        order: Number,
        _id: false,
      },
    ],
    crew: [
      {
        id: Number,
        name: String,
        job: String,
        department: String,
        _id: false,
      },
    ],
  },
  streamingProviders: {
    type: Map,
    of: {
      link: String,
      services: {
        streaming: [
          {
            provider_id: Number,
            provider_name: String,
            logo_path: String,
            display_priority: Number,
            _id: false,
          },
        ],
        rent: [
          {
            provider_id: Number,
            provider_name: String,
            logo_path: String,
            display_priority: Number,
            _id: false,
          },
        ],
        buy: [
          {
            provider_id: Number,
            provider_name: String,
            logo_path: String,
            display_priority: Number,
            _id: false,
          },
        ],
        free: [
          {
            provider_id: Number,
            provider_name: String,
            logo_path: String,
            display_priority: Number,
            _id: false,
          },
        ],
        ads: [
          {
            provider_id: Number,
            provider_name: String,
            logo_path: String,
            display_priority: Number,
            _id: false,
          },
        ],
      },
    },
  },
  lastUpdated: { type: Date, default: Date.now },
});

// Indexes for improved query performance
TVSeriesSchema.index({ title: 1 });
TVSeriesSchema.index({ popularity: -1 });
TVSeriesSchema.index({ releaseDate: -1 });
TVSeriesSchema.index({ voteAverage: -1 });
TVSeriesSchema.index({ "genres.name": 1 });

export default mongoose.models.TVSeries || mongoose.model("TVSeries", TVSeriesSchema);
