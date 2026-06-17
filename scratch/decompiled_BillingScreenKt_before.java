package com.example.sasloopmanager;

import android.content.Context;
import android.widget.Toast;
import androidx.compose.foundation.BackgroundKt;
import androidx.compose.foundation.BorderKt;
import androidx.compose.foundation.BorderStroke;
import androidx.compose.foundation.BorderStrokeKt;
import androidx.compose.foundation.ClickableKt;
import androidx.compose.foundation.OverscrollEffect;
import androidx.compose.foundation.ScrollKt;
import androidx.compose.foundation.gestures.FlingBehavior;
import androidx.compose.foundation.interaction.MutableInteractionSource;
import androidx.compose.foundation.layout.Arrangement;
import androidx.compose.foundation.layout.BoxKt;
import androidx.compose.foundation.layout.BoxScope;
import androidx.compose.foundation.layout.BoxScopeInstance;
import androidx.compose.foundation.layout.ColumnKt;
import androidx.compose.foundation.layout.ColumnScope;
import androidx.compose.foundation.layout.ColumnScopeInstance;
import androidx.compose.foundation.layout.PaddingKt;
import androidx.compose.foundation.layout.PaddingValues;
import androidx.compose.foundation.layout.RowKt;
import androidx.compose.foundation.layout.RowScope;
import androidx.compose.foundation.layout.RowScopeInstance;
import androidx.compose.foundation.layout.SizeKt;
import androidx.compose.foundation.layout.SpacerKt;
import androidx.compose.foundation.lazy.LazyDslKt;
import androidx.compose.foundation.lazy.LazyItemScope;
import androidx.compose.foundation.lazy.LazyListScope;
import androidx.compose.foundation.lazy.LazyListState;
import androidx.compose.foundation.lazy.grid.GridCells;
import androidx.compose.foundation.lazy.grid.LazyGridDslKt;
import androidx.compose.foundation.lazy.grid.LazyGridScope;
import androidx.compose.foundation.lazy.grid.LazyGridState;
import androidx.compose.foundation.shape.CornerBasedShape;
import androidx.compose.foundation.shape.RoundedCornerShapeKt;
import androidx.compose.foundation.text.BasicTextFieldKt;
import androidx.compose.foundation.text.KeyboardActions;
import androidx.compose.foundation.text.KeyboardOptions;
import androidx.compose.foundation.text.TextAutoSize;
import androidx.compose.foundation.text.selection.TextSelectionColors;
import androidx.compose.material.icons.Icons;
import androidx.compose.material.icons.filled.ArrowBackKt;
import androidx.compose.material.icons.filled.CardGiftcardKt;
import androidx.compose.material3.ButtonColors;
import androidx.compose.material3.ButtonDefaults;
import androidx.compose.material3.ButtonElevation;
import androidx.compose.material3.ButtonKt;
import androidx.compose.material3.CardDefaults;
import androidx.compose.material3.CardElevation;
import androidx.compose.material3.CardKt;
import androidx.compose.material3.CheckboxColors;
import androidx.compose.material3.CheckboxDefaults;
import androidx.compose.material3.CheckboxKt;
import androidx.compose.material3.ChipKt;
import androidx.compose.material3.DividerKt;
import androidx.compose.material3.FilterChipDefaults;
import androidx.compose.material3.IconButtonColors;
import androidx.compose.material3.IconButtonKt;
import androidx.compose.material3.IconKt;
import androidx.compose.material3.MaterialTheme;
import androidx.compose.material3.OutlinedTextFieldDefaults;
import androidx.compose.material3.OutlinedTextFieldKt;
import androidx.compose.material3.ProgressIndicatorKt;
import androidx.compose.material3.SelectableChipElevation;
import androidx.compose.material3.SurfaceKt;
import androidx.compose.material3.SwitchDefaults;
import androidx.compose.material3.SwitchKt;
import androidx.compose.material3.TabKt;
import androidx.compose.material3.TabRowKt;
import androidx.compose.material3.TextFieldColors;
import androidx.compose.material3.TextKt;
import androidx.compose.runtime.Applier;
import androidx.compose.runtime.Composable;
import androidx.compose.runtime.ComposableInferredTarget;
import androidx.compose.runtime.ComposableTarget;
import androidx.compose.runtime.ComposablesKt;
import androidx.compose.runtime.Composer;
import androidx.compose.runtime.ComposerKt;
import androidx.compose.runtime.CompositionLocal;
import androidx.compose.runtime.CompositionLocalMap;
import androidx.compose.runtime.EffectsKt;
import androidx.compose.runtime.MutableState;
import androidx.compose.runtime.RecomposeScopeImplKt;
import androidx.compose.runtime.ScopeUpdateScope;
import androidx.compose.runtime.SnapshotMutationPolicy;
import androidx.compose.runtime.SnapshotStateKt;
import androidx.compose.runtime.State;
import androidx.compose.runtime.Updater;
import androidx.compose.runtime.internal.ComposableLambdaKt;
import androidx.compose.runtime.snapshots.SnapshotStateMap;
import androidx.compose.ui.Alignment;
import androidx.compose.ui.ComposedModifierKt;
import androidx.compose.ui.Modifier;
import androidx.compose.ui.draw.ClipKt;
import androidx.compose.ui.graphics.Brush;
import androidx.compose.ui.graphics.Color;
import androidx.compose.ui.graphics.Shadow;
import androidx.compose.ui.graphics.Shape;
import androidx.compose.ui.graphics.SolidColor;
import androidx.compose.ui.graphics.drawscope.DrawStyle;
import androidx.compose.ui.graphics.vector.ImageVector;
import androidx.compose.ui.layout.MeasurePolicy;
import androidx.compose.ui.node.ComposeUiNode;
import androidx.compose.ui.platform.AndroidCompositionLocals_androidKt;
import androidx.compose.ui.semantics.Role;
import androidx.compose.ui.text.PlatformTextStyle;
import androidx.compose.ui.text.TextStyle;
import androidx.compose.ui.text.font.FontFamily;
import androidx.compose.ui.text.font.FontStyle;
import androidx.compose.ui.text.font.FontSynthesis;
import androidx.compose.ui.text.font.FontWeight;
import androidx.compose.ui.text.input.KeyboardType;
import androidx.compose.ui.text.input.PlatformImeOptions;
import androidx.compose.ui.text.input.VisualTransformation;
import androidx.compose.ui.text.intl.LocaleList;
import androidx.compose.ui.text.style.BaselineShift;
import androidx.compose.ui.text.style.LineHeightStyle;
import androidx.compose.ui.text.style.TextAlign;
import androidx.compose.ui.text.style.TextDecoration;
import androidx.compose.ui.text.style.TextGeometricTransform;
import androidx.compose.ui.text.style.TextIndent;
import androidx.compose.ui.text.style.TextMotion;
import androidx.compose.ui.text.style.TextOverflow;
import androidx.compose.ui.unit.Dp;
import androidx.compose.ui.unit.TextUnitKt;
import androidx.compose.ui.window.AndroidDialog_androidKt;
import androidx.compose.ui.window.DialogProperties;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$149$0$5$0$0$;
import com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$149$0$5$1$0$;
import com.example.sasloopmanager.BillingScreenKt$MenuSubTab$lambda$0$1$0$;
import com.example.sasloopmanager.BillingScreenKt$MenuSubTab$lambda$0$4$0$;
import com.example.sasloopmanager.BillingScreenKt$SplitBillDialog$lambda$1$0$0$13$0$;
import com.example.sasloopmanager.BillingScreenKt$parsePhoneNumber$;
import com.example.sasloopmanager.ComposableSingletons;
import com.example.sasloopmanager.data.CategoryItem;
import com.example.sasloopmanager.data.CustomerHistoryResponse;
import com.example.sasloopmanager.data.MenuItem;
import com.example.sasloopmanager.data.OptionGroup;
import com.example.sasloopmanager.data.OptionItem;
import com.example.sasloopmanager.data.Order;
import com.example.sasloopmanager.data.PosSettings;
import com.example.sasloopmanager.data.SelectedModifier;
import com.example.sasloopmanager.data.StaffUser;
import com.example.sasloopmanager.data.TableItem;
import com.example.sasloopmanager.data.UserProfile;
import com.example.sasloopmanager.theme.ColorKt;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import kotlin.Metadata;
import kotlin.Triple;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.collections.IntIterator;
import kotlin.collections.MapsKt;
import kotlin.coroutines.Continuation;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.functions.Function3;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.SourceDebugExtension;
import kotlin.jvm.internal.StringCompanionObject;
import kotlin.ranges.IntRange;
import kotlin.ranges.RangesKt;
import kotlin.text.StringsKt;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

/* compiled from: BillingScreen.kt */
@Metadata(mv = {2, 3, 0}, k = 2, xi = 48, d1 = {"��à\u0001\n��\n\u0002\u0010\u0002\n��\n\u0002\u0018\u0002\n��\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n��\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n��\n\u0002\u0018\u0002\n��\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0006\n��\n\u0002\u0010\b\n��\n\u0002\u0010\u000b\n\u0002\b\u0006\n\u0002\u0018\u0002\n��\n\u0002\u0010\t\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\r\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010 \n\u0002\u0018\u0002\n��\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n��\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\f\n\u0002\u0010$\n��\n\u0002\u0018\u0002\n\u0002\b\u001f\n\u0002\u0018\u0002\n\u0002\b*\n\u0002\u0018\u0002\n��\n\u0002\u0018\u0002\n��\n\u0002\u0018\u0002\n\u0002\b\u001e\u001a!\u0010��\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0005H\u0007¢\u0006\u0002\u0010\u0006\u001aG\u0010\u0007\u001a\u00020\u00012\b\b\u0002\u0010\b\u001a\u00020\t2\u0006\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\u000b2\u0006\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u00102\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00010\u0012H\u0003¢\u0006\u0004\b\u0013\u0010\u0014\u001a\u008b\u0001\u0010\u0015\u001a\u00020\u00012\u0006\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00020\u000b2\b\u0010\u0019\u001a\u0004\u0018\u00010\u001a2\u0006\u0010\u001b\u001a\u00020\u001c2\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0006\u0010\u001d\u001a\u00020\u001e2\u0006\u0010\u001f\u001a\u00020\u001e2\u0006\u0010 \u001a\u00020\u000b2\u0006\u0010!\u001a\u00020\u001c2\u0006\u0010\"\u001a\u00020\u001e2\u0006\u0010#\u001a\u00020\u001e2\b\u0010$\u001a\u0004\u0018\u00010%2\b\u0010&\u001a\u0004\u0018\u00010'2\b\b\u0002\u0010(\u001a\u00020\u001eH\u0003¢\u0006\u0002\u0010)\u001a\u007f\u0010*\u001a\u00020\u00012\u0006\u0010+\u001a\u00020,2\u0006\u0010-\u001a\u00020\u001c2\u0006\u0010.\u001a\u00020\u001c2\f\u0010/\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u00100\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0006\u00101\u001a\u00020\u001e2\u0006\u0010 \u001a\u00020\u000b2\u0006\u00102\u001a\u00020\u001e2\u0006\u0010!\u001a\u00020\u001c2\b\b\u0002\u00103\u001a\u00020\u001e2\b\b\u0002\u00104\u001a\u00020\u001e2\b\b\u0002\u00105\u001a\u00020\u001eH\u0003¢\u0006\u0002\u00106\u001a\u0018\u00107\u001a\u00020\u000b2\u0006\u00108\u001a\u00020\u001a2\u0006\u00109\u001a\u00020:H\u0002\u001a=\u0010;\u001a\u00020\u00012\u0006\u0010<\u001a\u00020\u000b2\u0006\u0010=\u001a\u00020\u000b2\b\b\u0002\u0010>\u001a\u00020\u001e2\b\b\u0002\u0010?\u001a\u00020\u00102\b\b\u0002\u0010@\u001a\u00020AH\u0007¢\u0006\u0004\bB\u0010C\u001aY\u0010D\u001a\u00020\u00012\u0006\u0010+\u001a\u00020,2\f\u0010E\u001a\b\u0012\u0004\u0012\u00020G0F2\f\u0010H\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u001e\u0010/\u001a\u001a\u0012\n\u0012\b\u0012\u0004\u0012\u00020J0F\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010I2\u0006\u0010 \u001a\u00020\u000bH\u0003¢\u0006\u0002\u0010K\u001a\"\u0010N\u001a\u0014\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b0O2\u0006\u0010P\u001a\u00020\u000bH\u0002\u001ae\u0010Q\u001a\u00020\u00012\u0006\u0010=\u001a\u00020\u000b2\u0012\u0010R\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010T\u001a\u00020\u000b2\b\b\u0002\u0010\b\u001a\u00020\t2\b\b\u0002\u0010U\u001a\u00020V2\b\b\u0002\u0010W\u001a\u00020\u001e2\b\b\u0002\u0010@\u001a\u00020A2\b\b\u0002\u0010X\u001a\u00020YH\u0003¢\u0006\u0004\bZ\u0010[\u001a\u001d\u0010\\\u001a\u00020\u00012\u0006\u0010]\u001a\u00020\u000b2\u0006\u0010^\u001a\u00020\u000bH\u0003¢\u0006\u0002\u0010_\u001a3\u0010`\u001a\u00020\u00012\u0006\u0010<\u001a\u00020\u000b2\u0006\u0010=\u001a\u00020\u000b2\b\b\u0002\u0010>\u001a\u00020\u001e2\b\b\u0002\u0010@\u001a\u00020AH\u0003¢\u0006\u0004\ba\u0010b\u001aG\u0010c\u001a\u00020\u00012\f\u0010d\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0012\u0010e\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0006\u0010\u0002\u001a\u00020\u00032\u0006\u00109\u001a\u00020:2\u0006\u0010g\u001a\u00020hH\u0007¢\u0006\u0002\u0010i\u001ag\u0010j\u001a\u00020\u00012\f\u0010d\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0012\u0010k\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0006\u00109\u001a\u00020:2\u0006\u0010l\u001a\u00020\u000b2\u0006\u0010m\u001a\u00020\u000b2\u0006\u0010n\u001a\u00020\u000b2\u0006\u0010o\u001a\u00020\u000b2\u0006\u0010p\u001a\u00020\u001e2\u0006\u0010g\u001a\u00020hH\u0007¢\u0006\u0002\u0010q\u001aû\u0001\u0010r\u001a\u00020\u00012\f\u0010d\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0012\u0010k\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0006\u0010m\u001a\u00020\u000b2\u0006\u0010n\u001a\u00020\u000b2\u0006\u0010o\u001a\u00020\u000b2\u0006\u00109\u001a\u00020:2\u0006\u0010l\u001a\u00020\u000b2\u0006\u0010p\u001a\u00020\u001e2\u0006\u0010s\u001a\u00020\u000b2\u0006\u0010t\u001a\u00020\u000b2\u0012\u0010u\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010v\u001a\u00020\u000b2\u0006\u0010w\u001a\u00020\u000b2\u0006\u0010x\u001a\u00020\u000b2\u0006\u0010y\u001a\u00020\u000b2\u0006\u0010z\u001a\u00020\u000b2\u0006\u0010{\u001a\u00020\u000b2\u0006\u0010|\u001a\u00020\u000b2\u0006\u0010}\u001a\u00020\u000b2\u0006\u0010~\u001a\u00020\u000b2\b\u0010\u007f\u001a\u0004\u0018\u00010\u00172\t\u0010\u0080\u0001\u001a\u0004\u0018\u00010\u000b2\b\u0010\u0004\u001a\u0004\u0018\u00010\u00052\u0006\u0010\u0002\u001a\u00020\u00032\u0006\u0010g\u001a\u00020hH\u0007¢\u0006\u0003\u0010\u0081\u0001\u001aõ\u0001\u0010\u0082\u0001\u001a\u00020\u00012\u0007\u0010\u0083\u0001\u001a\u00020\u000b2\u0007\u0010\u0084\u0001\u001a\u00020\u000b2\u0013\u0010\u0085\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0007\u0010\u0086\u0001\u001a\u00020\u000b2\u000e\u0010\u0087\u0001\u001a\t\u0012\u0005\u0012\u00030\u0088\u00010F2\u0007\u0010\u0089\u0001\u001a\u00020\u001e2\t\u0010\u008a\u0001\u001a\u0004\u0018\u00010\u000b2\r\u0010\u008b\u0001\u001a\b\u0012\u0004\u0012\u00020,0F2\u0013\u0010\u008c\u0001\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0012\u0010e\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0007\u0010\u008d\u0001\u001a\u00020\u001c2\u0007\u0010\u008e\u0001\u001a\u00020\u000b2\f\u0010E\u001a\b\u0012\u0004\u0012\u00020G0F2\u0006\u00109\u001a\u00020:2\u0006\u0010\u0002\u001a\u00020\u00032\u0013\u0010\u008f\u0001\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010\u0090\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010SH\u0007¢\u0006\u0003\u0010\u0091\u0001\u001añ\u0002\u0010\u0092\u0001\u001a\u00020\u00012\t\u0010\u0093\u0001\u001a\u0004\u0018\u00010\u001c2\r\u0010\u0094\u0001\u001a\b\u0012\u0004\u0012\u00020%0F2\b\u0010\u007f\u001a\u0004\u0018\u00010\u00172\u0013\u0010\u008c\u0001\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0012\u0010e\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0006\u0010z\u001a\u00020\u000b2\u0006\u0010{\u001a\u00020\u000b2\u0013\u0010\u0095\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010|\u001a\u00020\u000b2\u0013\u0010\u0096\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010}\u001a\u00020\u000b2\u0013\u0010\u0097\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010v\u001a\u00020\u000b2\u0013\u0010\u0098\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010w\u001a\u00020\u000b2\u0013\u0010\u0099\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010x\u001a\u00020\u000b2\u0013\u0010\u009a\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010y\u001a\u00020\u000b2\u0013\u0010\u009b\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\t\u0010\u0080\u0001\u001a\u0004\u0018\u00010\u000b2\u0006\u00109\u001a\u00020:2\u0006\u0010\u0002\u001a\u00020\u00032\b\u0010\u0004\u001a\u0004\u0018\u00010\u00052\u0006\u0010g\u001a\u00020h2\u0013\u0010\u0090\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010SH\u0007¢\u0006\u0003\u0010\u009c\u0001\u001aæ\u0003\u0010\u009d\u0001\u001a\u00020\u00012\u0012\u0010k\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f2\u0006\u00109\u001a\u00020:2\u0006\u0010l\u001a\u00020\u000b2\u0006\u0010m\u001a\u00020\u000b2\u0013\u0010\u009e\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010n\u001a\u00020\u000b2\u0013\u0010\u009f\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010o\u001a\u00020\u000b2\u0013\u0010 \u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010s\u001a\u00020\u000b2\u0013\u0010¡\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010p\u001a\u00020\u001e2\u0013\u0010¢\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010v\u001a\u00020\u000b2\u0006\u0010w\u001a\u00020\u000b2\u0006\u0010y\u001a\u00020\u000b2\u0006\u0010{\u001a\u00020\u000b2\u0006\u0010|\u001a\u00020\u000b2\u0006\u0010}\u001a\u00020\u000b2\t\u0010\u0093\u0001\u001a\u0004\u0018\u00010\u001c2\u0006\u0010~\u001a\u00020\u000b2\u0006\u0010z\u001a\u00020\u000b2\b\u0010\u007f\u001a\u0004\u0018\u00010\u00172\t\u0010\u0080\u0001\u001a\u0004\u0018\u00010\u000b2\b\u0010\u0004\u001a\u0004\u0018\u00010\u00052\u0006\u0010\u0002\u001a\u00020\u00032\u0006\u0010g\u001a\u00020h2\u0013\u0010£\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010¤\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010¥\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010¦\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010§\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010¨\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010©\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010S2\u0013\u0010ª\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u001e\u0012\u0004\u0012\u00020\u00010SH\u0007¢\u0006\u0003\u0010«\u0001\"\u0014\u0010L\u001a\b\u0012\u0004\u0012\u00020M0FX\u0082\u0004¢\u0006\u0002\n��¨\u0006¬\u0001²\u0006\u0011\u0010\u00ad\u0001\u001a\b\u0012\u0004\u0012\u00020,0FX\u008a\u0084\u0002²\u0006\u0012\u0010\u0087\u0001\u001a\t\u0012\u0005\u0012\u00030\u0088\u00010FX\u008a\u0084\u0002²\u0006\u000b\u0010\u0086\u0001\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\u000b\u0010\u0083\u0001\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\u0017\u0010\u008c\u0001\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0fX\u008a\u0084\u0002²\u0006\u0016\u0010e\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0fX\u008a\u0084\u0002²\u0006\u0011\u0010®\u0001\u001a\b\u0012\u0004\u0012\u00020\u00170FX\u008a\u0084\u0002²\u0006\u0011\u0010\u0094\u0001\u001a\b\u0012\u0004\u0012\u00020%0FX\u008a\u0084\u0002²\u0006\u0017\u0010¯\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b0fX\u008a\u0084\u0002²\u0006\u0017\u0010°\u0001\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020'0fX\u008a\u0084\u0002²\u0006#\u0010±\u0001\u001a\u001a\u0012\u0004\u0012\u00020\u000b\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0f0fX\u008a\u0084\u0002²\u0006\u000e\u0010²\u0001\u001a\u0005\u0018\u00010³\u0001X\u008a\u0084\u0002²\u0006\u0012\u0010´\u0001\u001a\t\u0012\u0005\u0012\u00030µ\u00010FX\u008a\u0084\u0002²\u0006\f\u0010¶\u0001\u001a\u00030·\u0001X\u008a\u0084\u0002²\u0006\n\u0010z\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\f\u0010\u007f\u001a\u0004\u0018\u00010\u0017X\u008a\u0084\u0002²\u0006\u000b\u0010\u0089\u0001\u001a\u00020\u001eX\u008a\u0084\u0002²\u0006\r\u0010\u008a\u0001\u001a\u0004\u0018\u00010\u000bX\u008a\u0084\u0002²\u0006\r\u0010¸\u0001\u001a\u0004\u0018\u00010\u001eX\u008a\u0084\u0002²\u0006\r\u0010\u0093\u0001\u001a\u0004\u0018\u00010\u001cX\u008a\u0084\u0002²\u0006\n\u00109\u001a\u00020:X\u008a\u0084\u0002²\u0006\u0010\u0010E\u001a\b\u0012\u0004\u0012\u00020G0FX\u008a\u0084\u0002²\u0006\u000b\u0010\u008d\u0001\u001a\u00020\u001cX\u008a\u0084\u0002²\u0006\u000b\u0010\u008e\u0001\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\r\u0010¹\u0001\u001a\u0004\u0018\u00010,X\u008a\u008e\u0002²\u0006\u000b\u0010º\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0084\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010»\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010v\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010w\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010y\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010l\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010t\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010m\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010n\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010o\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010~\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\n\u0010s\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u0013\u0010{\u001a\u000b ¼\u0001*\u0004\u0018\u00010\u000b0\u000bX\u008a\u008e\u0002²\u0006\u0013\u0010|\u001a\u000b ¼\u0001*\u0004\u0018\u00010\u000b0\u000bX\u008a\u008e\u0002²\u0006\n\u0010}\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010½\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010¾\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010¿\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\r\u0010\u0080\u0001\u001a\u0004\u0018\u00010\u000bX\u008a\u008e\u0002²\u0006\n\u0010p\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010À\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Á\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Â\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Ã\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Ä\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Å\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Æ\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Ç\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010È\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010É\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Ê\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\n\u0010x\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010Ë\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010Ì\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010Í\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Î\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Ï\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u0011\u0010Ð\u0001\u001a\b\u0012\u0004\u0012\u00020J0FX\u008a\u008e\u0002²\u0006\u000b\u0010Ñ\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010Ò\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010Ó\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010Ô\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010Õ\u0001\u001a\u00020\u000bX\u008a\u008e\u0002"}, d2 = {"BillingScreen", "", "billingViewModel", "Lcom/example/sasloopmanager/BillingViewModel;", "user", "Lcom/example/sasloopmanager/data/UserProfile;", "(Lcom/example/sasloopmanager/BillingViewModel;Lcom/example/sasloopmanager/data/UserProfile;Landroidx/compose/runtime/Composer;II)V", "FlowCard", "modifier", "Landroidx/compose/ui/Modifier;", "title", "", "subtext", "icon", "Landroidx/compose/ui/graphics/vector/ImageVector;", "iconColor", "Landroidx/compose/ui/graphics/Color;", "onClick", "Lkotlin/Function0;", "FlowCard-FHprtrg", "(Landroidx/compose/ui/Modifier;Ljava/lang/String;Ljava/lang/String;Landroidx/compose/ui/graphics/vector/ImageVector;JLkotlin/jvm/functions/Function0;Landroidx/compose/runtime/Composer;II)V", "TableCard", "table", "Lcom/example/sasloopmanager/data/TableItem;", "status", "orderTotal", "", "orderItemsCount", "", "showBillDetails", "", "showOrderStatus", "currency", "decimalPlaces", "showKOTNoOnTable", "displayTimeOnTable", "activeOrder", "Lcom/example/sasloopmanager/data/Order;", "activeTimestamp", "", "isSelected", "(Lcom/example/sasloopmanager/data/TableItem;Ljava/lang/String;Ljava/lang/Double;ILkotlin/jvm/functions/Function0;ZZLjava/lang/String;IZZLcom/example/sasloopmanager/data/Order;Ljava/lang/Long;ZLandroidx/compose/runtime/Composer;III)V", "MenuItemCard", "item", "Lcom/example/sasloopmanager/data/MenuItem;", "qtyInCart", "punchedQty", "onAdd", "onRemove", "isCompact", "showItemCodeDetails", "showItemImage", "showItemsDetails", "showItemsPrepTime", "(Lcom/example/sasloopmanager/data/MenuItem;IILkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function0;ZLjava/lang/String;ZIZZZLandroidx/compose/runtime/Composer;III)V", "formatPrice", "price", "posSettings", "Lcom/example/sasloopmanager/data/PosSettings;", "ReceiptRow", "label", "value", "isBold", "color", "fontSize", "Landroidx/compose/ui/unit/TextUnit;", "ReceiptRow-6jM-SoI", "(Ljava/lang/String;Ljava/lang/String;ZJJLandroidx/compose/runtime/Composer;II)V", "ItemCustomizationDialog", "optionGroups", "", "Lcom/example/sasloopmanager/data/OptionGroup;", "onDismiss", "Lkotlin/Function2;", "Lcom/example/sasloopmanager/data/SelectedModifier;", "(Lcom/example/sasloopmanager/data/MenuItem;Ljava/util/List;Lkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function2;Ljava/lang/String;Landroidx/compose/runtime/Composer;I)V", "countryCodes", "Lcom/example/sasloopmanager/CountryCodeItem;", "parsePhoneNumber", "Lkotlin/Triple;", "fullPhone", "CompactTextField", "onValueChange", "Lkotlin/Function1;", "placeholder", "keyboardOptions", "Landroidx/compose/foundation/text/KeyboardOptions;", "singleLine", "shape", "Landroidx/compose/foundation/shape/CornerBasedShape;", "CompactTextField-03iij_k", "(Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Landroidx/compose/ui/Modifier;Landroidx/compose/foundation/text/KeyboardOptions;ZJLandroidx/compose/foundation/shape/CornerBasedShape;Landroidx/compose/runtime/Composer;II)V", "ThermalGridRow", "left", "right", "(Ljava/lang/String;Ljava/lang/String;Landroidx/compose/runtime/Composer;I)V", "ThermalReceiptRow", "ThermalReceiptRow-JHQioms", "(Ljava/lang/String;Ljava/lang/String;ZJLandroidx/compose/runtime/Composer;II)V", "OldKotDialog", "onDismissRequest", "oldKotItems", "", "context", "Landroid/content/Context;", "(Lkotlin/jvm/functions/Function0;Ljava/util/Map;Lcom/example/sasloopmanager/BillingViewModel;Lcom/example/sasloopmanager/data/PosSettings;Landroid/content/Context;Landroidx/compose/runtime/Composer;I)V", "SplitBillDialog", "billingItems", "orderType", "discountInput", "serviceChargeInput", "deliveryChargeInput", "isComplimentaryOrder", "(Lkotlin/jvm/functions/Function0;Ljava/util/Map;Lcom/example/sasloopmanager/data/PosSettings;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLandroid/content/Context;Landroidx/compose/runtime/Composer;I)V", "PaymentDialog", "advancePaidInput", "paymentMethod", "onPaymentMethodChange", "customerName", "customerPhone", "selectedDialCode", "customerAddress", "activeFlow", "preOrderDate", "preOrderTime", "preOrderTypeInput", "preOrderIdInput", "selectedTable", "selectedWaiter", "(Lkotlin/jvm/functions/Function0;Ljava/util/Map;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/example/sasloopmanager/data/PosSettings;Ljava/lang/String;ZLjava/lang/String;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/example/sasloopmanager/data/TableItem;Ljava/lang/String;Lcom/example/sasloopmanager/data/UserProfile;Lcom/example/sasloopmanager/BillingViewModel;Landroid/content/Context;Landroidx/compose/runtime/Composer;III)V", "MenuSubTab", "searchQuery", "foodTypeFilter", "onFoodTypeFilterChange", "selectedCategory", "categories", "Lcom/example/sasloopmanager/data/CategoryItem;", "isLoading", "error", "sortedItems", "cart", "selectedPriceTier", "currentOrderType", "onSelectItemForModifiers", "onActiveSubTabChange", "(Ljava/lang/String;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Ljava/util/List;ZLjava/lang/String;Ljava/util/List;Ljava/util/Map;Ljava/util/Map;ILjava/lang/String;Ljava/util/List;Lcom/example/sasloopmanager/data/PosSettings;Lcom/example/sasloopmanager/BillingViewModel;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Landroidx/compose/runtime/Composer;II)V", "KotSubTab", "editingOrderId", "activeOrders", "onPreOrderDateChange", "onPreOrderTimeChange", "onPreOrderTypeInputChange", "onCustomerNameChange", "onCustomerPhoneChange", "onSelectedDialCodeChange", "onCustomerAddressChange", "(Ljava/lang/Integer;Ljava/util/List;Lcom/example/sasloopmanager/data/TableItem;Ljava/util/Map;Ljava/util/Map;Ljava/lang/String;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lcom/example/sasloopmanager/data/PosSettings;Lcom/example/sasloopmanager/BillingViewModel;Lcom/example/sasloopmanager/data/UserProfile;Landroid/content/Context;Lkotlin/jvm/functions/Function1;Landroidx/compose/runtime/Composer;III)V", "BillingSubTab", "onDiscountInputChange", "onServiceChargeInputChange", "onDeliveryChargeInputChange", "onAdvancePaidInputChange", "onIsComplimentaryOrderChange", "onShowPaymentDialogChange", "onShowOldKotDialogChange", "onShowSplitBillDialogChange", "onShowPreviewDialogChange", "onShowDiscountDialogChange", "onShowChargesDialogChange", "onShowWaiterDialogChange", "onShowHistoryDialogChange", "(Ljava/util/Map;Lcom/example/sasloopmanager/data/PosSettings;Ljava/lang/String;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Lkotlin/jvm/functions/Function1;ZLkotlin/jvm/functions/Function1;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/Integer;Ljava/lang/String;Ljava/lang/String;Lcom/example/sasloopmanager/data/TableItem;Ljava/lang/String;Lcom/example/sasloopmanager/data/UserProfile;Lcom/example/sasloopmanager/BillingViewModel;Landroid/content/Context;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Lkotlin/jvm/functions/Function1;Landroidx/compose/runtime/Composer;IIII)V", "app", "catalog", "tables", "tableStatuses", "tableActiveTimestamps", "tableCarts", "customerHistory", "Lcom/example/sasloopmanager/data/CustomerHistoryResponse;", "staffList", "Lcom/example/sasloopmanager/data/StaffUser;", "flowState", "Lcom/example/sasloopmanager/BillingFlowState;", "orderSuccess", "selectedItemForModifiers", "activeSubTab", "selectedDepartment", "kotlin.jvm.PlatformType", "kotNote", "coversCount", "ebillEnabled", "showDiscountDialog", "showChargesDialog", "showWaiterDialog", "showHistoryDialog", "showPreviewDialog", "showCustomerDialog", "showNoteDialog", "showPaymentDialog", "showOldKotDialog", "showSplitBillDialog", "showCategoryMenu", "selectedCountryFlag", "selectedCountryCode", "showCountryDropdown", "hasAutoRedirected", "ticks", "selectedModifiers", "kitchenNote", "selectAllOldKot", "splitTab", "portions", "percentInput"})
@SourceDebugExtension({"SMAP\nBillingScreen.kt\nKotlin\n*S Kotlin\n*F\n+ 1 BillingScreen.kt\ncom/example/sasloopmanager/BillingScreenKt\n+ 2 Composer.kt\nandroidx/compose/runtime/ComposerKt\n+ 3 _Collections.kt\nkotlin/collections/CollectionsKt___CollectionsKt\n+ 4 fake.kt\nkotlin/jvm/internal/FakeKt\n+ 5 CompositionLocal.kt\nandroidx/compose/runtime/CompositionLocal\n+ 6 _Maps.kt\nkotlin/collections/MapsKt___MapsKt\n+ 7 Box.kt\nandroidx/compose/foundation/layout/BoxKt\n+ 8 Layout.kt\nandroidx/compose/ui/layout/LayoutKt\n+ 9 Composables.kt\nandroidx/compose/runtime/ComposablesKt\n+ 10 Column.kt\nandroidx/compose/foundation/layout/ColumnKt\n+ 11 Dp.kt\nandroidx/compose/ui/unit/DpKt\n+ 12 Row.kt\nandroidx/compose/foundation/layout/RowKt\n+ 13 LazyDsl.kt\nandroidx/compose/foundation/lazy/LazyDslKt\n+ 14 LazyGridDsl.kt\nandroidx/compose/foundation/lazy/grid/LazyGridDslKt\n+ 15 SnapshotState.kt\nandroidx/compose/runtime/SnapshotStateKt__SnapshotStateKt\n+ 16 ImageRequest.kt\ncoil/request/ImageRequest$Builder\n+ 17 Maps.kt\nkotlin/collections/MapsKt__MapsKt\n*L\n1#1,3091:1\n1128#2,6:3092\n1128#2,3:3098\n1131#2,3:3104\n1128#2,3:3107\n1131#2,3:3111\n1128#2,6:3114\n1128#2,6:3120\n1128#2,6:3126\n1128#2,6:3132\n1128#2,6:3138\n1128#2,6:3144\n1128#2,6:3150\n1128#2,6:3156\n1128#2,6:3162\n1128#2,6:3168\n1128#2,6:3174\n1128#2,6:3180\n1128#2,6:3186\n1128#2,6:3192\n1128#2,6:3198\n1128#2,6:3204\n1128#2,6:3211\n1128#2,6:3217\n1128#2,6:3223\n1128#2,6:3229\n1128#2,6:3235\n1128#2,6:3241\n1128#2,6:3247\n1128#2,6:3253\n1128#2,6:3259\n1128#2,6:3265\n1128#2,6:3271\n1128#2,6:3277\n1128#2,6:3283\n1128#2,6:3289\n1128#2,6:3295\n1128#2,6:3301\n1128#2,6:3307\n1128#2,6:3313\n1128#2,6:3319\n1128#2,6:3325\n1128#2,3:3331\n1131#2,3:3336\n1128#2,6:3339\n1128#2,6:3345\n1128#2,6:3351\n1128#2,6:3357\n1128#2,3:3366\n1131#2,3:3371\n1128#2,6:3374\n1128#2,6:3506\n1128#2,6:3588\n1128#2,6:3594\n1128#2,6:3600\n1128#2,6:3710\n1128#2,6:3716\n1128#2,6:3758\n1128#2,6:3764\n1128#2,3:3817\n1131#2,3:3834\n1128#2,3:3837\n1131#2,3:3843\n1128#2,6:3880\n1128#2,6:3889\n1128#2,6:3931\n1128#2,6:3937\n1128#2,6:3943\n1128#2,6:3949\n1128#2,6:3955\n1128#2,6:3961\n1128#2,6:3967\n1128#2,6:3973\n1128#2,6:3979\n1128#2,6:3985\n1128#2,6:3991\n1128#2,6:3997\n1128#2,6:4003\n1128#2,6:4073\n1128#2,6:4079\n1128#2,6:4085\n1128#2,6:4127\n1128#2,6:4133\n1128#2,6:4139\n1128#2,6:4145\n1128#2,6:4151\n1128#2,6:4157\n1128#2,6:4163\n1128#2,6:4169\n1128#2,6:4183\n1128#2,6:4189\n1128#2,6:4195\n1128#2,6:4201\n1128#2,6:4207\n1128#2,6:4213\n1128#2,6:4234\n1128#2,6:4240\n1128#2,6:4288\n1128#2,6:4294\n1128#2,3:4301\n1131#2,3:4307\n1128#2,6:4381\n1128#2,6:4387\n1128#2,6:4393\n1128#2,6:4399\n1128#2,6:4469\n1128#2,6:4477\n1128#2,6:4526\n1128#2,6:4605\n1128#2,3:4615\n1131#2,3:4620\n1128#2,6:4862\n1128#2,6:4869\n1128#2,6:4959\n1128#2,6:4966\n1128#2,6:5155\n1128#2,6:5162\n1128#2,6:5169\n1128#2,6:5180\n1128#2,6:5264\n1128#2,6:5382\n1128#2,6:5388\n1128#2,6:5532\n1128#2,6:5782\n1128#2,6:6003\n1128#2,6:6180\n1128#2,6:6222\n1128#2,6:6470\n1128#2,6:6561\n1128#2,6:6572\n1128#2,6:6918\n1128#2,6:6926\n1128#2,6:6971\n1128#2,6:6979\n1128#2,6:7089\n1128#2,6:7128\n1128#2,6:7167\n1128#2,6:7259\n1128#2,6:7329\n1128#2,6:7336\n1128#2,6:7348\n1128#2,6:7384\n1128#2,6:7390\n1128#2,6:7396\n1128#2,6:7438\n1128#2,6:7445\n1128#2,6:7519\n1128#2,6:7571\n1128#2,6:7609\n1128#2,6:7620\n1128#2,6:7628\n1128#2,6:7703\n1128#2,6:7785\n1128#2,6:7867\n1128#2,6:7947\n1128#2,6:7964\n1807#3,3:3101\n777#3:3363\n873#3,2:3364\n1068#3:3369\n1068#3:3370\n1642#3,10:3820\n1915#3:3830\n1916#3:3832\n1652#3:3833\n777#3:3840\n873#3,2:3841\n777#3:4304\n873#3,2:4305\n1080#3:4310\n1915#3:4475\n1916#3:4519\n777#3:6277\n873#3,2:6278\n1807#3,3:6280\n832#3:6283\n862#3,2:6284\n832#3:6286\n862#3,2:6287\n777#3:6289\n873#3,2:6290\n1915#3:6427\n1915#3:6429\n1915#3:6463\n1807#3,3:6464\n1916#3:6550\n1916#3:6555\n1916#3:6557\n1924#3,3:6665\n1924#3,3:6668\n1786#3,3:6745\n1915#3,2:6882\n788#3:6997\n800#3:6998\n1924#3,2:6999\n801#3,2:7001\n1926#3:7003\n803#3:7004\n1586#3:7005\n1661#3,3:7006\n1807#3,3:7016\n1586#3:7019\n1661#3,3:7020\n1915#3:7517\n1916#3:7561\n1915#3:7782\n1916#3:7827\n1915#3:7864\n1916#3:7909\n1#4:3110\n1#4:3831\n75#5:3210\n75#5:4300\n75#5:5915\n221#6,2:3334\n221#6,2:4618\n221#6:4723\n222#6:4884\n221#6:5079\n222#6:5115\n70#7:3380\n67#7,9:3381\n70#7:3782\n68#7,8:3783\n77#7:3816\n70#7:4041\n67#7,9:4042\n77#7:4094\n70#7:4095\n67#7,9:4096\n77#7:4178\n77#7:4230\n70#7:4484\n68#7,8:4485\n77#7:4518\n70#7:4532\n68#7,8:4533\n77#7:4566\n70#7:4567\n68#7,8:4568\n77#7:4601\n70#7:4688\n68#7,8:4689\n77#7:4722\n70#7:5306\n66#7,10:5307\n77#7:5342\n70#7:5572\n68#7,8:5573\n77#7:5607\n70#7:5657\n67#7,9:5658\n77#7:5843\n70#7:5844\n66#7,10:5845\n77#7:5880\n70#7:5883\n67#7,9:5884\n77#7:6012\n70#7:6186\n68#7,8:6187\n77#7:6221\n70#7:6228\n68#7,8:6229\n77#7:6262\n70#7:6477\n67#7,9:6478\n77#7:6549\n70#7:6593\n68#7,8:6594\n77#7:6627\n70#7:6628\n66#7,10:6629\n77#7:6664\n70#7:6671\n66#7,10:6672\n77#7:6707\n70#7:6708\n66#7,10:6709\n77#7:6744\n70#7:6748\n66#7,10:6749\n77#7:6784\n70#7:7223\n68#7,8:7224\n77#7:7257\n70#7:7526\n68#7,8:7527\n77#7:7560\n70#7:7792\n68#7,8:7793\n77#7:7826\n70#7:7874\n68#7,8:7875\n77#7:7908\n81#8,6:3390\n88#8,6:3405\n81#8,6:3422\n88#8,6:3437\n81#8,6:3451\n88#8,6:3466\n81#8,6:3484\n88#8,6:3499\n81#8,6:3525\n88#8,6:3540\n96#8:3549\n96#8:3553\n81#8,6:3566\n88#8,6:3581\n96#8:3608\n96#8:3612\n81#8,6:3621\n88#8,6:3636\n81#8,6:3656\n88#8,6:3671\n81#8,6:3688\n88#8,6:3703\n96#8:3724\n81#8,6:3736\n88#8,6:3751\n96#8:3772\n96#8:3776\n96#8:3780\n81#8,6:3791\n88#8,6:3806\n96#8:3815\n81#8,6:3856\n88#8,6:3871\n96#8:3897\n81#8,6:3909\n88#8,6:3924\n81#8,6:4019\n88#8,6:4034\n81#8,6:4051\n88#8,6:4066\n96#8:4093\n81#8,6:4105\n88#8,6:4120\n96#8:4177\n96#8:4181\n96#8:4221\n96#8:4225\n96#8:4229\n81#8,6:4262\n88#8,6:4277\n96#8:4286\n81#8,6:4321\n88#8,6:4336\n96#8:4345\n81#8,6:4353\n88#8,6:4368\n96#8:4379\n81#8,6:4415\n88#8,6:4430\n81#8,6:4445\n88#8,6:4460\n81#8,6:4493\n88#8,6:4508\n96#8:4517\n96#8:4522\n81#8,6:4541\n88#8,6:4556\n96#8:4565\n81#8,6:4576\n88#8,6:4591\n96#8:4600\n96#8:4613\n81#8,6:4633\n88#8,6:4648\n81#8,6:4665\n88#8,6:4680\n81#8,6:4697\n88#8,6:4712\n96#8:4721\n81#8,6:4732\n88#8,6:4747\n81#8,6:4764\n88#8,6:4779\n81#8,6:4798\n88#8,6:4813\n96#8:4822\n96#8:4826\n81#8,6:4840\n88#8,6:4855\n96#8:4878\n96#8:4882\n96#8:4890\n81#8,6:4899\n88#8,6:4914\n81#8,6:4932\n88#8,6:4947\n96#8:4956\n96#8:4974\n96#8:4978\n81#8,6:4990\n88#8,6:5005\n81#8,6:5022\n88#8,6:5037\n81#8,6:5057\n88#8,6:5072\n81#8,6:5089\n88#8,6:5104\n96#8:5113\n96#8:5120\n81#8,6:5132\n88#8,6:5147\n96#8:5177\n81#8,6:5193\n88#8,6:5208\n81#8,6:5226\n88#8,6:5241\n96#8:5252\n96#8:5256\n96#8:5260\n96#8:5272\n81#8,6:5317\n88#8,6:5332\n96#8:5341\n81#8,6:5354\n88#8,6:5369\n96#8:5380\n81#8,6:5548\n88#8,6:5563\n81#8,6:5581\n88#8,6:5596\n96#8:5606\n81#8,6:5619\n88#8,6:5634\n96#8:5644\n96#8:5648\n81#8,6:5667\n88#8,6:5682\n81#8,6:5698\n88#8,6:5713\n81#8,6:5726\n88#8,6:5741\n81#8,6:5760\n88#8,6:5775\n96#8:5793\n96#8:5797\n81#8,6:5810\n88#8,6:5825\n96#8:5834\n96#8:5838\n96#8:5842\n81#8,6:5855\n88#8,6:5870\n96#8:5879\n81#8,6:5893\n88#8,6:5908\n81#8,6:5940\n88#8,6:5955\n81#8,6:5972\n88#8,6:5987\n96#8:5996\n96#8:6001\n96#8:6011\n81#8,6:6023\n88#8,6:6038\n81#8,6:6051\n88#8,6:6066\n81#8,6:6085\n88#8,6:6100\n96#8:6110\n96#8:6114\n81#8,6:6124\n88#8,6:6139\n81#8,6:6158\n88#8,6:6173\n81#8,6:6195\n88#8,6:6210\n96#8:6220\n81#8,6:6237\n88#8,6:6252\n96#8:6261\n96#8:6265\n96#8:6271\n96#8:6275\n81#8,6:6303\n88#8,6:6318\n81#8,6:6331\n88#8,6:6346\n81#8,6:6364\n88#8,6:6379\n96#8:6388\n96#8:6392\n81#8,6:6405\n88#8,6:6420\n81#8,6:6441\n88#8,6:6456\n81#8,6:6487\n88#8,6:6502\n81#8,6:6520\n88#8,6:6535\n96#8:6544\n96#8:6548\n96#8:6553\n96#8:6569\n96#8:6582\n81#8,6:6602\n88#8,6:6617\n96#8:6626\n81#8,6:6639\n88#8,6:6654\n96#8:6663\n81#8,6:6682\n88#8,6:6697\n96#8:6706\n81#8,6:6719\n88#8,6:6734\n96#8:6743\n81#8,6:6759\n88#8,6:6774\n96#8:6783\n81#8,6:6795\n88#8,6:6810\n81#8,6:6828\n88#8,6:6843\n81#8,6:6860\n88#8,6:6875\n96#8:6886\n81#8,6:6895\n88#8,6:6910\n96#8:6934\n81#8,6:6948\n88#8,6:6963\n96#8:6987\n96#8:6991\n96#8:6995\n81#8,6:7036\n88#8,6:7051\n81#8,6:7065\n88#8,6:7080\n96#8:7097\n81#8,6:7106\n88#8,6:7121\n81#8,6:7144\n88#8,6:7159\n96#8:7176\n96#8:7180\n81#8,6:7193\n88#8,6:7208\n96#8:7220\n81#8,6:7232\n88#8,6:7247\n96#8:7256\n81#8,6:7272\n88#8,6:7287\n81#8,6:7306\n88#8,6:7321\n96#8:7344\n96#8:7356\n96#8:7360\n81#8,6:7416\n88#8,6:7431\n81#8,6:7461\n88#8,6:7476\n81#8,6:7495\n88#8,6:7510\n81#8,6:7535\n88#8,6:7550\n96#8:7559\n96#8:7564\n96#8:7569\n81#8,6:7587\n88#8,6:7602\n96#8:7618\n81#8,6:7644\n88#8,6:7659\n96#8:7668\n81#8,6:7681\n88#8,6:7696\n96#8:7711\n96#8:7715\n81#8,6:7728\n88#8,6:7743\n81#8,6:7760\n88#8,6:7775\n81#8,6:7801\n88#8,6:7816\n96#8:7825\n96#8:7830\n81#8,6:7842\n88#8,6:7857\n81#8,6:7883\n88#8,6:7898\n96#8:7907\n96#8:7912\n81#8,6:7925\n88#8,6:7940\n96#8:7955\n96#8:7959\n391#9,9:3396\n400#9:3411\n391#9,9:3428\n400#9:3443\n391#9,9:3457\n400#9:3472\n391#9,9:3490\n400#9:3505\n391#9,9:3531\n400#9,3:3546\n401#9,2:3551\n391#9,9:3572\n400#9:3587\n401#9,2:3606\n401#9,2:3610\n391#9,9:3627\n400#9:3642\n391#9,9:3662\n400#9:3677\n391#9,9:3694\n400#9:3709\n401#9,2:3722\n391#9,9:3742\n400#9:3757\n401#9,2:3770\n401#9,2:3774\n401#9,2:3778\n391#9,9:3797\n400#9,3:3812\n391#9,9:3862\n400#9:3877\n401#9,2:3895\n391#9,9:3915\n400#9:3930\n391#9,9:4025\n400#9:4040\n391#9,9:4057\n400#9:4072\n401#9,2:4091\n391#9,9:4111\n400#9:4126\n401#9,2:4175\n401#9,2:4179\n401#9,2:4219\n401#9,2:4223\n401#9,2:4227\n391#9,9:4268\n400#9,3:4283\n391#9,9:4327\n400#9,3:4342\n391#9,9:4359\n400#9:4374\n401#9,2:4377\n391#9,9:4421\n400#9:4436\n391#9,9:4451\n400#9:4466\n391#9,9:4499\n400#9,3:4514\n401#9,2:4520\n391#9,9:4547\n400#9,3:4562\n391#9,9:4582\n400#9,3:4597\n401#9,2:4611\n391#9,9:4639\n400#9:4654\n391#9,9:4671\n400#9:4686\n391#9,9:4703\n400#9,3:4718\n391#9,9:4738\n400#9:4753\n391#9,9:4770\n400#9:4785\n391#9,9:4804\n400#9,3:4819\n401#9,2:4824\n391#9,9:4846\n400#9:4861\n401#9,2:4876\n401#9,2:4880\n401#9,2:4888\n391#9,9:4905\n400#9:4920\n391#9,9:4938\n400#9,3:4953\n401#9,2:4972\n401#9,2:4976\n391#9,9:4996\n400#9:5011\n391#9,9:5028\n400#9:5043\n391#9,9:5063\n400#9:5078\n391#9,9:5095\n400#9,3:5110\n401#9,2:5118\n391#9,9:5138\n400#9:5153\n401#9,2:5175\n391#9,9:5199\n400#9:5214\n391#9,9:5232\n400#9:5247\n401#9,2:5250\n401#9,2:5254\n401#9,2:5258\n401#9,2:5270\n391#9,9:5323\n400#9,3:5338\n391#9,9:5360\n400#9:5375\n401#9,2:5378\n391#9,9:5554\n400#9:5569\n391#9,9:5587\n400#9:5602\n401#9,2:5604\n391#9,9:5625\n400#9:5640\n401#9,2:5642\n401#9,2:5646\n391#9,9:5673\n400#9:5688\n391#9,9:5704\n400#9:5719\n391#9,9:5732\n400#9:5747\n391#9,9:5766\n400#9:5781\n401#9,2:5791\n401#9,2:5795\n391#9,9:5816\n400#9,3:5831\n401#9,2:5836\n401#9,2:5840\n391#9,9:5861\n400#9,3:5876\n391#9,9:5899\n400#9:5914\n391#9,9:5946\n400#9:5961\n391#9,9:5978\n400#9,3:5993\n401#9,2:5999\n401#9,2:6009\n391#9,9:6029\n400#9:6044\n391#9,9:6057\n400#9:6072\n391#9,9:6091\n400#9:6106\n401#9,2:6108\n401#9,2:6112\n391#9,9:6130\n400#9:6145\n391#9,9:6164\n400#9:6179\n391#9,9:6201\n400#9:6216\n401#9,2:6218\n391#9,9:6243\n400#9,3:6258\n401#9,2:6263\n401#9,2:6269\n401#9,2:6273\n391#9,9:6309\n400#9:6324\n391#9,9:6337\n400#9:6352\n391#9,9:6370\n400#9,3:6385\n401#9,2:6390\n391#9,9:6411\n400#9:6426\n391#9,9:6447\n400#9:6462\n391#9,9:6493\n400#9:6508\n391#9,9:6526\n400#9,3:6541\n401#9,2:6546\n401#9,2:6551\n401#9,2:6567\n401#9,2:6580\n391#9,9:6608\n400#9,3:6623\n391#9,9:6645\n400#9,3:6660\n391#9,9:6688\n400#9,3:6703\n391#9,9:6725\n400#9,3:6740\n391#9,9:6765\n400#9,3:6780\n391#9,9:6801\n400#9:6816\n391#9,9:6834\n400#9:6849\n391#9,9:6866\n400#9:6881\n401#9,2:6884\n391#9,9:6901\n400#9:6916\n401#9,2:6932\n391#9,9:6954\n400#9:6969\n401#9,2:6985\n401#9,2:6989\n401#9,2:6993\n391#9,9:7042\n400#9:7057\n391#9,9:7071\n400#9:7086\n401#9,2:7095\n391#9,9:7112\n400#9:7127\n391#9,9:7150\n400#9:7165\n401#9,2:7174\n401#9,2:7178\n391#9,9:7199\n400#9:7214\n401#9,2:7218\n391#9,9:7238\n400#9,3:7253\n391#9,9:7278\n400#9:7293\n391#9,9:7312\n400#9:7327\n401#9,2:7342\n401#9,2:7354\n401#9,2:7358\n391#9,9:7422\n400#9:7437\n391#9,9:7467\n400#9:7482\n391#9,9:7501\n400#9:7516\n391#9,9:7541\n400#9,3:7556\n401#9,2:7562\n401#9,2:7567\n391#9,9:7593\n400#9:7608\n401#9,2:7616\n391#9,9:7650\n400#9,3:7665\n391#9,9:7687\n400#9:7702\n401#9,2:7709\n401#9,2:7713\n391#9,9:7734\n400#9:7749\n391#9,9:7766\n400#9:7781\n391#9,9:7807\n400#9,3:7822\n401#9,2:7828\n391#9,9:7848\n400#9:7863\n391#9,9:7889\n400#9,3:7904\n401#9,2:7910\n391#9,9:7931\n400#9:7946\n401#9,2:7953\n401#9,2:7957\n87#10:3412\n84#10,9:3413\n87#10,6:3615\n87#10:3645\n83#10,10:3646\n94#10:3777\n94#10:3781\n87#10:3846\n84#10,9:3847\n94#10:3898\n87#10:3899\n84#10,9:3900\n94#10:4222\n94#10:4226\n87#10:4405\n84#10,9:4406\n94#10:4614\n87#10:4624\n85#10,8:4625\n87#10:4656\n85#10,8:4657\n87#10:4754\n84#10,9:4755\n94#10:4827\n94#10:4891\n87#10:4921\n83#10,10:4922\n94#10:4957\n94#10:4979\n87#10:4981\n85#10,8:4982\n87#10:5013\n85#10,8:5014\n87#10:5048\n85#10,8:5049\n94#10:5121\n94#10:5261\n94#10:5273\n87#10:5539\n85#10,8:5540\n87#10:5608\n83#10,10:5609\n94#10:5645\n94#10:5649\n87#10:5689\n85#10,8:5690\n87#10:5799\n83#10,10:5800\n94#10:5835\n94#10:5839\n87#10:5962\n84#10,9:5963\n94#10:5997\n87#10:6013\n84#10,9:6014\n94#10:6276\n87#10:6293\n84#10,9:6294\n87#10:6353\n83#10,10:6354\n94#10:6389\n87#10:6395\n84#10,9:6396\n87#10:6509\n83#10,10:6510\n94#10:6545\n94#10:6570\n94#10:6583\n87#10:6785\n84#10,9:6786\n87#10:6850\n84#10,9:6851\n94#10:6887\n87#10:6938\n84#10,9:6939\n94#10:6988\n94#10:6996\n87#10:7025\n83#10,10:7026\n94#10:7361\n87#10,6:7410\n87#10:7452\n85#10,8:7453\n94#10:7570\n87#10:7578\n85#10,8:7579\n94#10:7619\n87#10:7635\n85#10,8:7636\n94#10:7669\n94#10:7716\n87#10,6:7722\n94#10:7960\n122#11:3444\n122#11:3512\n122#11:3513\n122#11:3614\n122#11:3643\n122#11:3644\n122#11:3678\n122#11:3726\n122#11:3878\n122#11:3879\n122#11:3886\n122#11:3887\n122#11:3888\n122#11:4231\n122#11:4232\n122#11:4233\n122#11:4246\n122#11:4247\n122#11:4248\n122#11:4249\n122#11:4250\n122#11:4251\n122#11:4252\n122#11:4253\n122#11:4254\n122#11:4255\n122#11:4311\n122#11:4312\n122#11:4313\n122#11:4314\n122#11:4375\n122#11:4376\n122#11:4437\n122#11:4438\n122#11:4467\n122#11:4468\n122#11:4476\n122#11:4483\n122#11:4524\n122#11:4525\n122#11:4602\n122#11:4603\n122#11:4604\n122#11:4623\n122#11:4655\n122#11:4687\n122#11:4724\n122#11:4725\n122#11:4786\n122#11:4787\n122#11:4788\n122#11:4828\n122#11:4868\n122#11:4875\n122#11:4885\n122#11:4886\n122#11:4887\n122#11:4892\n122#11:4958\n122#11:4965\n122#11:4980\n122#11:5012\n122#11:5044\n122#11:5045\n122#11:5046\n122#11:5047\n122#11:5116\n122#11:5117\n122#11:5122\n122#11:5154\n122#11:5161\n122#11:5168\n122#11:5179\n122#11:5186\n122#11:5248\n122#11:5249\n122#11:5262\n122#11:5263\n122#11:5274\n122#11:5376\n122#11:5377\n122#11:5538\n122#11:5570\n122#11:5571\n122#11:5603\n122#11:5641\n122#11:5650\n122#11:5651\n122#11:5652\n122#11:5656\n122#11:5748\n122#11:5788\n122#11:5789\n122#11:5790\n122#11:5881\n122#11:5882\n122#11:5927\n122#11:5928\n122#11:5929\n122#11:5930\n122#11:5931\n122#11:5932\n122#11:5933\n122#11:5998\n122#11:6073\n122#11:6107\n122#11:6116\n122#11:6117\n122#11:6146\n122#11:6217\n122#11:6267\n122#11:6268\n122#11:6292\n122#11:6394\n122#11:6428\n122#11:6430\n122#11:6431\n122#11:6467\n122#11:6468\n122#11:6469\n122#11:6476\n122#11:6556\n122#11:6558\n122#11:6559\n122#11:6560\n122#11:6571\n122#11:6578\n122#11:6579\n122#11:6590\n122#11:6591\n122#11:6592\n122#11:6817\n122#11:6888\n122#11:6917\n122#11:6924\n122#11:6925\n122#11:6936\n122#11:6937\n122#11:6970\n122#11:6977\n122#11:6978\n122#11:7023\n122#11:7024\n122#11:7058\n122#11:7087\n122#11:7088\n122#11:7099\n122#11:7166\n122#11:7173\n122#11:7182\n122#11:7215\n122#11:7216\n122#11:7217\n122#11:7222\n122#11:7258\n122#11:7265\n122#11:7294\n122#11:7328\n122#11:7335\n122#11:7346\n122#11:7347\n122#11:7365\n122#11:7366\n122#11:7367\n122#11:7408\n122#11:7409\n122#11:7444\n122#11:7451\n122#11:7483\n122#11:7518\n122#11:7525\n122#11:7566\n122#11:7577\n122#11:7615\n122#11:7626\n122#11:7627\n122#11:7634\n122#11:7670\n122#11:7671\n122#11:7717\n122#11:7718\n122#11:7719\n122#11:7720\n122#11:7721\n122#11:7750\n122#11:7783\n122#11:7784\n122#11:7791\n122#11:7832\n122#11:7865\n122#11:7866\n122#11:7873\n122#11:7914\n122#11:7915\n122#11:7961\n122#11:7962\n122#11:7963\n99#12,6:3445\n99#12:3473\n95#12,10:3474\n99#12:3514\n95#12,10:3515\n106#12:3550\n106#12:3554\n99#12:3555\n95#12,10:3556\n106#12:3609\n106#12:3613\n99#12:3679\n97#12,8:3680\n106#12:3725\n99#12:3727\n97#12,8:3728\n106#12:3773\n99#12:4009\n96#12,9:4010\n106#12:4182\n99#12,6:4256\n106#12:4287\n99#12,6:4315\n106#12:4346\n99#12,6:4347\n106#12:4380\n99#12,6:4439\n106#12:4523\n99#12,6:4726\n99#12:4789\n97#12,8:4790\n106#12:4823\n99#12:4829\n95#12,10:4830\n106#12:4879\n106#12:4883\n99#12,6:4893\n106#12:4975\n99#12:5080\n97#12,8:5081\n106#12:5114\n99#12:5123\n97#12,8:5124\n106#12:5178\n99#12,6:5187\n99#12:5215\n95#12,10:5216\n106#12:5253\n106#12:5257\n99#12:5343\n95#12,10:5344\n106#12:5381\n99#12,6:5720\n99#12:5749\n95#12,10:5750\n106#12:5794\n106#12:5798\n99#12,6:5934\n106#12:6002\n99#12,6:6045\n99#12:6074\n95#12,10:6075\n106#12:6111\n106#12:6115\n99#12,6:6118\n99#12:6147\n95#12,10:6148\n106#12:6266\n106#12:6272\n99#12,6:6325\n106#12:6393\n99#12:6432\n97#12,8:6433\n106#12:6554\n99#12:6818\n96#12,9:6819\n99#12,6:6889\n106#12:6935\n106#12:6992\n99#12,6:7059\n106#12:7098\n99#12,6:7100\n99#12:7134\n96#12,9:7135\n106#12:7177\n106#12:7181\n99#12:7183\n96#12,9:7184\n106#12:7221\n99#12,6:7266\n99#12:7295\n95#12,10:7296\n106#12:7345\n106#12:7357\n99#12:7484\n95#12,10:7485\n106#12:7565\n99#12:7672\n97#12,8:7673\n106#12:7712\n99#12:7751\n97#12,8:7752\n106#12:7831\n99#12:7833\n97#12,8:7834\n106#12:7913\n99#12:7916\n97#12,8:7917\n106#12:7956\n168#13,13:5275\n168#13,13:7368\n168#13,13:7970\n524#14,18:5288\n524#14,18:7983\n85#15:5394\n85#15:5395\n85#15:5396\n85#15:5397\n85#15:5398\n85#15:5399\n85#15:5400\n85#15:5401\n85#15:5402\n85#15:5403\n85#15:5404\n85#15:5405\n85#15:5406\n85#15:5407\n85#15:5408\n85#15:5409\n85#15:5410\n85#15:5411\n85#15:5412\n85#15:5413\n85#15:5414\n85#15:5415\n85#15:5416\n85#15:5417\n85#15:5418\n117#15,2:5419\n85#15:5421\n117#15,2:5422\n85#15:5424\n117#15,2:5425\n85#15:5427\n117#15,2:5428\n85#15:5430\n117#15,2:5431\n85#15:5433\n117#15,2:5434\n85#15:5436\n117#15,2:5437\n85#15:5439\n117#15,2:5440\n85#15:5442\n117#15,2:5443\n85#15:5445\n117#15,2:5446\n85#15:5448\n117#15,2:5449\n85#15:5451\n117#15,2:5452\n85#15:5454\n117#15,2:5455\n85#15:5457\n117#15,2:5458\n85#15:5460\n117#15,2:5461\n85#15:5463\n117#15,2:5464\n85#15:5466\n117#15,2:5467\n85#15:5469\n117#15,2:5470\n85#15:5472\n117#15,2:5473\n85#15:5475\n117#15,2:5476\n85#15:5478\n117#15,2:5479\n85#15:5481\n117#15,2:5482\n85#15:5484\n117#15,2:5485\n85#15:5487\n117#15,2:5488\n85#15:5490\n117#15,2:5491\n85#15:5493\n117#15,2:5494\n85#15:5496\n117#15,2:5497\n85#15:5499\n117#15,2:5500\n85#15:5502\n117#15,2:5503\n85#15:5505\n117#15,2:5506\n85#15:5508\n117#15,2:5509\n85#15:5511\n117#15,2:5512\n85#15:5514\n117#15,2:5515\n85#15:5517\n117#15,2:5518\n85#15:5520\n117#15,2:5521\n85#15:5523\n117#15,2:5524\n85#15:5526\n117#15,2:5527\n85#15:5529\n117#15,2:5530\n85#15:5653\n117#15,2:5654\n85#15:6584\n117#15,2:6585\n85#15:6587\n117#15,2:6588\n85#15:7362\n117#15,2:7363\n85#15:7381\n117#15,2:7382\n85#15:7402\n117#15,2:7403\n85#15:7405\n117#15,2:7406\n490#16,11:5916\n567#17:7009\n552#17,6:7010\n*S KotlinDebug\n*F\n+ 1 BillingScreen.kt\ncom/example/sasloopmanager/BillingScreenKt\n*L\n88#1:3092,6\n97#1:3098,3\n97#1:3104,3\n106#1:3107,3\n106#1:3111,3\n111#1:3114,6\n116#1:3120,6\n119#1:3126,6\n122#1:3132,6\n140#1:3138,6\n141#1:3144,6\n142#1:3150,6\n151#1:3156,6\n152#1:3162,6\n153#1:3168,6\n154#1:3174,6\n155#1:3180,6\n158#1:3186,6\n159#1:3192,6\n163#1:3198,6\n167#1:3204,6\n172#1:3211,6\n173#1:3217,6\n174#1:3223,6\n175#1:3229,6\n176#1:3235,6\n178#1:3241,6\n179#1:3247,6\n180#1:3253,6\n181#1:3259,6\n182#1:3265,6\n183#1:3271,6\n184#1:3277,6\n185#1:3283,6\n186#1:3289,6\n187#1:3295,6\n188#1:3301,6\n189#1:3307,6\n190#1:3313,6\n191#1:3319,6\n192#1:3325,6\n195#1:3331,3\n195#1:3336,3\n203#1:3339,6\n204#1:3345,6\n217#1:3351,6\n222#1:3357,6\n307#1:3366,3\n307#1:3371,3\n318#1:3374,6\n351#1:3506,6\n391#1:3588,6\n395#1:3594,6\n399#1:3600,6\n440#1:3710,6\n450#1:3716,6\n465#1:3758,6\n475#1:3764,6\n490#1:3817,3\n490#1:3834,3\n494#1:3837,3\n494#1:3843,3\n507#1:3880,6\n538#1:3889,6\n696#1:3931,6\n698#1:3937,6\n700#1:3943,6\n702#1:3949,6\n704#1:3955,6\n719#1:3961,6\n720#1:3967,6\n721#1:3973,6\n722#1:3979,6\n723#1:3985,6\n724#1:3991,6\n725#1:3997,6\n726#1:4003,6\n735#1:4073,6\n748#1:4079,6\n749#1:4085,6\n762#1:4127,6\n764#1:4133,6\n766#1:4139,6\n768#1:4145,6\n770#1:4151,6\n772#1:4157,6\n774#1:4163,6\n780#1:4169,6\n789#1:4183,6\n799#1:4189,6\n822#1:4195,6\n823#1:4201,6\n833#1:4207,6\n843#1:4213,6\n928#1:4234,6\n930#1:4240,6\n1485#1:4288,6\n1486#1:4294,6\n1489#1:4301,3\n1489#1:4307,3\n1825#1:4381,6\n1826#1:4387,6\n1827#1:4393,6\n1830#1:4399,6\n2481#1:4469,6\n2502#1:4477,6\n2522#1:4526,6\n2569#1:4605,6\n2625#1:4615,3\n2625#1:4620,3\n2718#1:4862,6\n2732#1:4869,6\n2813#1:4959,6\n2840#1:4966,6\n3014#1:5155,6\n3025#1:5162,6\n3036#1:5169,6\n3052#1:5180,6\n3074#1:5264,6\n643#1:5382,6\n655#1:5388,6\n323#1:5532,6\n1003#1:5782,6\n1288#1:6003,6\n1396#1:6180,6\n1416#1:6222,6\n1569#1:6470,6\n1620#1:6561,6\n1642#1:6572,6\n1939#1:6918,6\n1943#1:6926,6\n1951#1:6971,6\n1958#1:6979,6\n1857#1:7089,6\n1877#1:7128,6\n1885#1:7167,6\n1916#1:7259,6\n1984#1:7329,6\n1991#1:7336,6\n2004#1:7348,6\n2090#1:7384,6\n2095#1:7390,6\n2100#1:7396,6\n2080#1:7438,6\n2106#1:7445,6\n2115#1:7519,6\n2132#1:7571,6\n2141#1:7609,6\n2151#1:7620,6\n2157#1:7628,6\n2233#1:7703,6\n2356#1:7785,6\n2377#1:7867,6\n2398#1:7947,6\n2526#1:7964,6\n99#1:3101,3\n291#1:3363\n291#1:3364,2\n309#1:3369\n310#1:3370\n491#1:3820,10\n491#1:3830\n491#1:3832\n491#1:3833\n495#1:3840\n495#1:3841,2\n1490#1:4304\n1490#1:4305,2\n1705#1:4310\n2496#1:4475\n2496#1:4519\n1570#1:6277\n1570#1:6278,2\n1571#1:6280,3\n1574#1:6283\n1574#1:6284,2\n1577#1:6286\n1577#1:6287,2\n1644#1:6289\n1644#1:6290,2\n1540#1:6427\n1550#1:6429\n1555#1:6463\n1556#1:6464,3\n1555#1:6550\n1550#1:6555\n1540#1:6557\n1880#1:6665,3\n1887#1:6668,3\n1951#1:6745,3\n1933#1:6882,2\n1985#1:6997\n1985#1:6998\n1985#1:6999,2\n1985#1:7001,2\n1985#1:7003\n1985#1:7004\n1985#1:7005\n1985#1:7006,3\n1995#1:7016,3\n1997#1:7019\n1997#1:7020,3\n2110#1:7517\n2110#1:7561\n2348#1:7782\n2348#1:7827\n2369#1:7864\n2369#1:7909\n491#1:3831\n171#1:3210\n1487#1:4300\n1141#1:5915\n197#1:3334,2\n2627#1:4618,2\n2664#1:4723\n2664#1:4884\n2964#1:5079\n2964#1:5115\n333#1:3380\n333#1:3381,9\n485#1:3782\n485#1:3783,8\n485#1:3816\n731#1:4041\n731#1:4042,9\n731#1:4094\n753#1:4095\n753#1:4096,9\n753#1:4178\n333#1:4230\n2498#1:4484\n2498#1:4485,8\n2498#1:4518\n2555#1:4532\n2555#1:4533,8\n2555#1:4566\n2559#1:4567\n2559#1:4568,8\n2559#1:4601\n2655#1:4688\n2655#1:4689,8\n2655#1:4722\n672#1:5306\n672#1:5307,10\n672#1:5342\n889#1:5572\n889#1:5573,8\n889#1:5607\n977#1:5657\n977#1:5658,9\n977#1:5843\n1209#1:5844\n1209#1:5845,10\n1209#1:5880\n1133#1:5883\n1133#1:5884,9\n1133#1:6012\n1389#1:6186\n1389#1:6187,8\n1389#1:6221\n1411#1:6228\n1411#1:6229,8\n1411#1:6262\n1559#1:6477\n1559#1:6478,9\n1559#1:6549\n1747#1:6593\n1747#1:6594,8\n1747#1:6627\n1864#1:6628\n1864#1:6629,10\n1864#1:6664\n1940#1:6671\n1940#1:6672,10\n1940#1:6707\n1944#1:6708\n1944#1:6709,10\n1944#1:6744\n1964#1:6748\n1964#1:6749,10\n1964#1:6784\n1912#1:7223\n1912#1:7224,8\n1912#1:7257\n2111#1:7526\n2111#1:7527,8\n2111#1:7560\n2350#1:7792\n2350#1:7793,8\n2350#1:7826\n2371#1:7874\n2371#1:7875,8\n2371#1:7908\n333#1:3390,6\n333#1:3405,6\n338#1:3422,6\n338#1:3437,6\n340#1:3451,6\n340#1:3466,6\n348#1:3484,6\n348#1:3499,6\n358#1:3525,6\n358#1:3540,6\n358#1:3549\n348#1:3553\n389#1:3566,6\n389#1:3581,6\n389#1:3608\n340#1:3612\n412#1:3621,6\n412#1:3636,6\n428#1:3656,6\n428#1:3671,6\n429#1:3688,6\n429#1:3703,6\n429#1:3724\n454#1:3736,6\n454#1:3751,6\n454#1:3772\n428#1:3776\n412#1:3780\n485#1:3791,6\n485#1:3806,6\n485#1:3815\n498#1:3856,6\n498#1:3871,6\n498#1:3897\n633#1:3909,6\n633#1:3924,6\n730#1:4019,6\n730#1:4034,6\n731#1:4051,6\n731#1:4066,6\n731#1:4093\n753#1:4105,6\n753#1:4120,6\n753#1:4177\n730#1:4181\n633#1:4221\n338#1:4225\n333#1:4229\n1457#1:4262,6\n1457#1:4277,6\n1457#1:4286\n1769#1:4321,6\n1769#1:4336,6\n1769#1:4345\n1786#1:4353,6\n1786#1:4368,6\n1786#1:4379\n2470#1:4415,6\n2470#1:4430,6\n2471#1:4445,6\n2471#1:4460,6\n2498#1:4493,6\n2498#1:4508,6\n2498#1:4517\n2471#1:4522\n2555#1:4541,6\n2555#1:4556,6\n2555#1:4565\n2559#1:4576,6\n2559#1:4591,6\n2559#1:4600\n2470#1:4613\n2633#1:4633,6\n2633#1:4648,6\n2640#1:4665,6\n2640#1:4680,6\n2655#1:4697,6\n2655#1:4712,6\n2655#1:4721\n2668#1:4732,6\n2668#1:4747,6\n2676#1:4764,6\n2676#1:4779,6\n2690#1:4798,6\n2690#1:4813,6\n2690#1:4822\n2676#1:4826\n2713#1:4840,6\n2713#1:4855,6\n2713#1:4878\n2668#1:4882\n2640#1:4890\n2790#1:4899,6\n2790#1:4914,6\n2797#1:4932,6\n2797#1:4947,6\n2797#1:4956\n2790#1:4974\n2633#1:4978\n2935#1:4990,6\n2935#1:5005,6\n2942#1:5022,6\n2942#1:5037,6\n2956#1:5057,6\n2956#1:5072,6\n2965#1:5089,6\n2965#1:5104,6\n2965#1:5113\n2956#1:5120\n3009#1:5132,6\n3009#1:5147,6\n3009#1:5177\n3047#1:5193,6\n3047#1:5208,6\n3057#1:5226,6\n3057#1:5241,6\n3057#1:5252\n3047#1:5256\n2942#1:5260\n2935#1:5272\n672#1:5317,6\n672#1:5332,6\n672#1:5341\n657#1:5354,6\n657#1:5369,6\n657#1:5380\n883#1:5548,6\n883#1:5563,6\n889#1:5581,6\n889#1:5596,6\n889#1:5606\n898#1:5619,6\n898#1:5634,6\n898#1:5644\n883#1:5648\n977#1:5667,6\n977#1:5682,6\n982#1:5698,6\n982#1:5713,6\n986#1:5726,6\n986#1:5741,6\n998#1:5760,6\n998#1:5775,6\n998#1:5793\n986#1:5797\n1054#1:5810,6\n1054#1:5825,6\n1054#1:5834\n982#1:5838\n977#1:5842\n1209#1:5855,6\n1209#1:5870,6\n1209#1:5879\n1133#1:5893,6\n1133#1:5908,6\n1241#1:5940,6\n1241#1:5955,6\n1249#1:5972,6\n1249#1:5987,6\n1249#1:5996\n1241#1:6001\n1133#1:6011\n1293#1:6023,6\n1293#1:6038,6\n1299#1:6051,6\n1299#1:6066,6\n1304#1:6085,6\n1304#1:6100,6\n1304#1:6110\n1299#1:6114\n1370#1:6124,6\n1370#1:6139,6\n1384#1:6158,6\n1384#1:6173,6\n1389#1:6195,6\n1389#1:6210,6\n1389#1:6220\n1411#1:6237,6\n1411#1:6252,6\n1411#1:6261\n1384#1:6265\n1370#1:6271\n1293#1:6275\n1502#1:6303,6\n1502#1:6318,6\n1508#1:6331,6\n1508#1:6346,6\n1513#1:6364,6\n1513#1:6379,6\n1513#1:6388\n1508#1:6392\n1535#1:6405,6\n1535#1:6420,6\n1551#1:6441,6\n1551#1:6456,6\n1559#1:6487,6\n1559#1:6502,6\n1587#1:6520,6\n1587#1:6535,6\n1587#1:6544\n1559#1:6548\n1551#1:6553\n1535#1:6569\n1502#1:6582\n1747#1:6602,6\n1747#1:6617,6\n1747#1:6626\n1864#1:6639,6\n1864#1:6654,6\n1864#1:6663\n1940#1:6682,6\n1940#1:6697,6\n1940#1:6706\n1944#1:6719,6\n1944#1:6734,6\n1944#1:6743\n1964#1:6759,6\n1964#1:6774,6\n1964#1:6783\n1925#1:6795,6\n1925#1:6810,6\n1926#1:6828,6\n1926#1:6843,6\n1927#1:6860,6\n1927#1:6875,6\n1927#1:6886\n1938#1:6895,6\n1938#1:6910,6\n1938#1:6934\n1948#1:6948,6\n1948#1:6963,6\n1948#1:6987\n1926#1:6991\n1925#1:6995\n1844#1:7036,6\n1844#1:7051,6\n1845#1:7065,6\n1845#1:7080,6\n1845#1:7097\n1870#1:7106,6\n1870#1:7121,6\n1875#1:7144,6\n1875#1:7159,6\n1875#1:7176\n1870#1:7180\n1899#1:7193,6\n1899#1:7208,6\n1899#1:7220\n1912#1:7232,6\n1912#1:7247,6\n1912#1:7256\n1978#1:7272,6\n1978#1:7287,6\n1983#1:7306,6\n1983#1:7321,6\n1983#1:7344\n1978#1:7356\n1844#1:7360\n2068#1:7416,6\n2068#1:7431,6\n2107#1:7461,6\n2107#1:7476,6\n2109#1:7495,6\n2109#1:7510,6\n2111#1:7535,6\n2111#1:7550,6\n2111#1:7559\n2109#1:7564\n2107#1:7569\n2137#1:7587,6\n2137#1:7602,6\n2137#1:7618\n2215#1:7644,6\n2215#1:7659,6\n2215#1:7668\n2221#1:7681,6\n2221#1:7696,6\n2221#1:7711\n2068#1:7715\n2289#1:7728,6\n2289#1:7743,6\n2344#1:7760,6\n2344#1:7775,6\n2350#1:7801,6\n2350#1:7816,6\n2350#1:7825\n2344#1:7830\n2365#1:7842,6\n2365#1:7857,6\n2371#1:7883,6\n2371#1:7898,6\n2371#1:7907\n2365#1:7912\n2386#1:7925,6\n2386#1:7940,6\n2386#1:7955\n2289#1:7959\n333#1:3396,9\n333#1:3411\n338#1:3428,9\n338#1:3443\n340#1:3457,9\n340#1:3472\n348#1:3490,9\n348#1:3505\n358#1:3531,9\n358#1:3546,3\n348#1:3551,2\n389#1:3572,9\n389#1:3587\n389#1:3606,2\n340#1:3610,2\n412#1:3627,9\n412#1:3642\n428#1:3662,9\n428#1:3677\n429#1:3694,9\n429#1:3709\n429#1:3722,2\n454#1:3742,9\n454#1:3757\n454#1:3770,2\n428#1:3774,2\n412#1:3778,2\n485#1:3797,9\n485#1:3812,3\n498#1:3862,9\n498#1:3877\n498#1:3895,2\n633#1:3915,9\n633#1:3930\n730#1:4025,9\n730#1:4040\n731#1:4057,9\n731#1:4072\n731#1:4091,2\n753#1:4111,9\n753#1:4126\n753#1:4175,2\n730#1:4179,2\n633#1:4219,2\n338#1:4223,2\n333#1:4227,2\n1457#1:4268,9\n1457#1:4283,3\n1769#1:4327,9\n1769#1:4342,3\n1786#1:4359,9\n1786#1:4374\n1786#1:4377,2\n2470#1:4421,9\n2470#1:4436\n2471#1:4451,9\n2471#1:4466\n2498#1:4499,9\n2498#1:4514,3\n2471#1:4520,2\n2555#1:4547,9\n2555#1:4562,3\n2559#1:4582,9\n2559#1:4597,3\n2470#1:4611,2\n2633#1:4639,9\n2633#1:4654\n2640#1:4671,9\n2640#1:4686\n2655#1:4703,9\n2655#1:4718,3\n2668#1:4738,9\n2668#1:4753\n2676#1:4770,9\n2676#1:4785\n2690#1:4804,9\n2690#1:4819,3\n2676#1:4824,2\n2713#1:4846,9\n2713#1:4861\n2713#1:4876,2\n2668#1:4880,2\n2640#1:4888,2\n2790#1:4905,9\n2790#1:4920\n2797#1:4938,9\n2797#1:4953,3\n2790#1:4972,2\n2633#1:4976,2\n2935#1:4996,9\n2935#1:5011\n2942#1:5028,9\n2942#1:5043\n2956#1:5063,9\n2956#1:5078\n2965#1:5095,9\n2965#1:5110,3\n2956#1:5118,2\n3009#1:5138,9\n3009#1:5153\n3009#1:5175,2\n3047#1:5199,9\n3047#1:5214\n3057#1:5232,9\n3057#1:5247\n3057#1:5250,2\n3047#1:5254,2\n2942#1:5258,2\n2935#1:5270,2\n672#1:5323,9\n672#1:5338,3\n657#1:5360,9\n657#1:5375\n657#1:5378,2\n883#1:5554,9\n883#1:5569\n889#1:5587,9\n889#1:5602\n889#1:5604,2\n898#1:5625,9\n898#1:5640\n898#1:5642,2\n883#1:5646,2\n977#1:5673,9\n977#1:5688\n982#1:5704,9\n982#1:5719\n986#1:5732,9\n986#1:5747\n998#1:5766,9\n998#1:5781\n998#1:5791,2\n986#1:5795,2\n1054#1:5816,9\n1054#1:5831,3\n982#1:5836,2\n977#1:5840,2\n1209#1:5861,9\n1209#1:5876,3\n1133#1:5899,9\n1133#1:5914\n1241#1:5946,9\n1241#1:5961\n1249#1:5978,9\n1249#1:5993,3\n1241#1:5999,2\n1133#1:6009,2\n1293#1:6029,9\n1293#1:6044\n1299#1:6057,9\n1299#1:6072\n1304#1:6091,9\n1304#1:6106\n1304#1:6108,2\n1299#1:6112,2\n1370#1:6130,9\n1370#1:6145\n1384#1:6164,9\n1384#1:6179\n1389#1:6201,9\n1389#1:6216\n1389#1:6218,2\n1411#1:6243,9\n1411#1:6258,3\n1384#1:6263,2\n1370#1:6269,2\n1293#1:6273,2\n1502#1:6309,9\n1502#1:6324\n1508#1:6337,9\n1508#1:6352\n1513#1:6370,9\n1513#1:6385,3\n1508#1:6390,2\n1535#1:6411,9\n1535#1:6426\n1551#1:6447,9\n1551#1:6462\n1559#1:6493,9\n1559#1:6508\n1587#1:6526,9\n1587#1:6541,3\n1559#1:6546,2\n1551#1:6551,2\n1535#1:6567,2\n1502#1:6580,2\n1747#1:6608,9\n1747#1:6623,3\n1864#1:6645,9\n1864#1:6660,3\n1940#1:6688,9\n1940#1:6703,3\n1944#1:6725,9\n1944#1:6740,3\n1964#1:6765,9\n1964#1:6780,3\n1925#1:6801,9\n1925#1:6816\n1926#1:6834,9\n1926#1:6849\n1927#1:6866,9\n1927#1:6881\n1927#1:6884,2\n1938#1:6901,9\n1938#1:6916\n1938#1:6932,2\n1948#1:6954,9\n1948#1:6969\n1948#1:6985,2\n1926#1:6989,2\n1925#1:6993,2\n1844#1:7042,9\n1844#1:7057\n1845#1:7071,9\n1845#1:7086\n1845#1:7095,2\n1870#1:7112,9\n1870#1:7127\n1875#1:7150,9\n1875#1:7165\n1875#1:7174,2\n1870#1:7178,2\n1899#1:7199,9\n1899#1:7214\n1899#1:7218,2\n1912#1:7238,9\n1912#1:7253,3\n1978#1:7278,9\n1978#1:7293\n1983#1:7312,9\n1983#1:7327\n1983#1:7342,2\n1978#1:7354,2\n1844#1:7358,2\n2068#1:7422,9\n2068#1:7437\n2107#1:7467,9\n2107#1:7482\n2109#1:7501,9\n2109#1:7516\n2111#1:7541,9\n2111#1:7556,3\n2109#1:7562,2\n2107#1:7567,2\n2137#1:7593,9\n2137#1:7608\n2137#1:7616,2\n2215#1:7650,9\n2215#1:7665,3\n2221#1:7687,9\n2221#1:7702\n2221#1:7709,2\n2068#1:7713,2\n2289#1:7734,9\n2289#1:7749\n2344#1:7766,9\n2344#1:7781\n2350#1:7807,9\n2350#1:7822,3\n2344#1:7828,2\n2365#1:7848,9\n2365#1:7863\n2371#1:7889,9\n2371#1:7904,3\n2365#1:7910,2\n2386#1:7931,9\n2386#1:7946\n2386#1:7953,2\n2289#1:7957,2\n338#1:3412\n338#1:3413,9\n412#1:3615,6\n428#1:3645\n428#1:3646,10\n428#1:3777\n412#1:3781\n498#1:3846\n498#1:3847,9\n498#1:3898\n633#1:3899\n633#1:3900,9\n633#1:4222\n338#1:4226\n2470#1:4405\n2470#1:4406,9\n2470#1:4614\n2633#1:4624\n2633#1:4625,8\n2640#1:4656\n2640#1:4657,8\n2676#1:4754\n2676#1:4755,9\n2676#1:4827\n2640#1:4891\n2797#1:4921\n2797#1:4922,10\n2797#1:4957\n2633#1:4979\n2935#1:4981\n2935#1:4982,8\n2942#1:5013\n2942#1:5014,8\n2956#1:5048\n2956#1:5049,8\n2956#1:5121\n2942#1:5261\n2935#1:5273\n883#1:5539\n883#1:5540,8\n898#1:5608\n898#1:5609,10\n898#1:5645\n883#1:5649\n982#1:5689\n982#1:5690,8\n1054#1:5799\n1054#1:5800,10\n1054#1:5835\n982#1:5839\n1249#1:5962\n1249#1:5963,9\n1249#1:5997\n1293#1:6013\n1293#1:6014,9\n1293#1:6276\n1502#1:6293\n1502#1:6294,9\n1513#1:6353\n1513#1:6354,10\n1513#1:6389\n1535#1:6395\n1535#1:6396,9\n1587#1:6509\n1587#1:6510,10\n1587#1:6545\n1535#1:6570\n1502#1:6583\n1925#1:6785\n1925#1:6786,9\n1927#1:6850\n1927#1:6851,9\n1927#1:6887\n1948#1:6938\n1948#1:6939,9\n1948#1:6988\n1925#1:6996\n1844#1:7025\n1844#1:7026,10\n1844#1:7361\n2068#1:7410,6\n2107#1:7452\n2107#1:7453,8\n2107#1:7570\n2137#1:7578\n2137#1:7579,8\n2137#1:7619\n2215#1:7635\n2215#1:7636,8\n2215#1:7669\n2068#1:7716\n2289#1:7722,6\n2289#1:7960\n344#1:3444\n352#1:3512\n356#1:3513\n415#1:3614\n425#1:3643\n428#1:3644\n431#1:3678\n456#1:3726\n505#1:3878\n506#1:3879\n535#1:3886\n536#1:3887\n537#1:3888\n877#1:4231\n879#1:4232\n881#1:4233\n963#1:4246\n965#1:4247\n971#1:4248\n973#1:4249\n1102#1:4250\n1105#1:4251\n1106#1:4252\n1108#1:4253\n1127#1:4254\n1129#1:4255\n1727#1:4311\n1742#1:4312\n1744#1:4313\n1745#1:4314\n1797#1:4375\n1804#1:4376\n2475#1:4437\n2477#1:4438\n2484#1:4467\n2485#1:4468\n2500#1:4476\n2503#1:4483\n2520#1:4524\n2521#1:4525\n2566#1:4602\n2567#1:4603\n2568#1:4604\n2637#1:4623\n2644#1:4655\n2658#1:4687\n2671#1:4724\n2672#1:4725\n2683#1:4786\n2691#1:4787\n2692#1:4788\n2714#1:4828\n2720#1:4868\n2734#1:4875\n2759#1:4885\n2769#1:4886\n2781#1:4887\n2793#1:4892\n2834#1:4958\n2848#1:4965\n2939#1:4980\n2946#1:5012\n2959#1:5044\n2960#1:5045\n2961#1:5046\n2962#1:5047\n2982#1:5116\n2998#1:5117\n3011#1:5122\n3016#1:5154\n3027#1:5161\n3038#1:5168\n3050#1:5179\n3053#1:5186\n3058#1:5248\n3059#1:5249\n3082#1:5262\n3085#1:5263\n354#1:5274\n666#1:5376\n670#1:5377\n886#1:5538\n891#1:5570\n892#1:5571\n896#1:5603\n900#1:5641\n1016#1:5650\n1031#1:5651\n1046#1:5652\n980#1:5656\n999#1:5748\n1008#1:5788\n1023#1:5789\n1038#1:5790\n1235#1:5881\n1136#1:5882\n1193#1:5927\n1195#1:5928\n1205#1:5929\n1207#1:5930\n1224#1:5931\n1228#1:5932\n1245#1:5933\n1275#1:5998\n1306#1:6073\n1311#1:6107\n1344#1:6116\n1356#1:6117\n1386#1:6146\n1400#1:6217\n1426#1:6267\n1427#1:6268\n1505#1:6292\n1532#1:6394\n1546#1:6428\n1552#1:6430\n1553#1:6431\n1562#1:6467\n1565#1:6468\n1567#1:6469\n1585#1:6476\n1608#1:6556\n1616#1:6558\n1624#1:6559\n1633#1:6560\n1639#1:6571\n1652#1:6578\n1653#1:6579\n1497#1:6590\n1498#1:6591\n1500#1:6592\n1926#1:6817\n1938#1:6888\n1939#1:6917\n1942#1:6924\n1943#1:6925\n1947#1:6936\n1948#1:6937\n1953#1:6970\n1955#1:6977\n1962#1:6978\n1989#1:7023\n2000#1:7024\n1849#1:7058\n1855#1:7087\n1857#1:7088\n1871#1:7099\n1890#1:7166\n1892#1:7173\n1900#1:7182\n1904#1:7215\n1905#1:7216\n1906#1:7217\n1912#1:7222\n1916#1:7258\n1979#1:7265\n1983#1:7294\n1984#1:7328\n1991#1:7335\n2011#1:7346\n2012#1:7347\n1837#1:7365\n1839#1:7366\n1842#1:7367\n2069#1:7408\n2071#1:7409\n2086#1:7444\n2107#1:7451\n2109#1:7483\n2114#1:7518\n2116#1:7525\n2123#1:7566\n2137#1:7577\n2146#1:7615\n2155#1:7626\n2156#1:7627\n2215#1:7634\n2222#1:7670\n2223#1:7671\n2063#1:7717\n2065#1:7718\n2066#1:7719\n2290#1:7720\n2292#1:7721\n2346#1:7750\n2353#1:7783\n2355#1:7784\n2357#1:7791\n2367#1:7832\n2374#1:7865\n2376#1:7866\n2378#1:7873\n2387#1:7914\n2388#1:7915\n2284#1:7961\n2286#1:7962\n2287#1:7963\n340#1:3445,6\n348#1:3473\n348#1:3474,10\n358#1:3514\n358#1:3515,10\n358#1:3550\n348#1:3554\n389#1:3555\n389#1:3556,10\n389#1:3609\n340#1:3613\n429#1:3679\n429#1:3680,8\n429#1:3725\n454#1:3727\n454#1:3728,8\n454#1:3773\n730#1:4009\n730#1:4010,9\n730#1:4182\n1457#1:4256,6\n1457#1:4287\n1769#1:4315,6\n1769#1:4346\n1786#1:4347,6\n1786#1:4380\n2471#1:4439,6\n2471#1:4523\n2668#1:4726,6\n2690#1:4789\n2690#1:4790,8\n2690#1:4823\n2713#1:4829\n2713#1:4830,10\n2713#1:4879\n2668#1:4883\n2790#1:4893,6\n2790#1:4975\n2965#1:5080\n2965#1:5081,8\n2965#1:5114\n3009#1:5123\n3009#1:5124,8\n3009#1:5178\n3047#1:5187,6\n3057#1:5215\n3057#1:5216,10\n3057#1:5253\n3047#1:5257\n657#1:5343\n657#1:5344,10\n657#1:5381\n986#1:5720,6\n998#1:5749\n998#1:5750,10\n998#1:5794\n986#1:5798\n1241#1:5934,6\n1241#1:6002\n1299#1:6045,6\n1304#1:6074\n1304#1:6075,10\n1304#1:6111\n1299#1:6115\n1370#1:6118,6\n1384#1:6147\n1384#1:6148,10\n1384#1:6266\n1370#1:6272\n1508#1:6325,6\n1508#1:6393\n1551#1:6432\n1551#1:6433,8\n1551#1:6554\n1926#1:6818\n1926#1:6819,9\n1938#1:6889,6\n1938#1:6935\n1926#1:6992\n1845#1:7059,6\n1845#1:7098\n1870#1:7100,6\n1875#1:7134\n1875#1:7135,9\n1875#1:7177\n1870#1:7181\n1899#1:7183\n1899#1:7184,9\n1899#1:7221\n1978#1:7266,6\n1983#1:7295\n1983#1:7296,10\n1983#1:7345\n1978#1:7357\n2109#1:7484\n2109#1:7485,10\n2109#1:7565\n2221#1:7672\n2221#1:7673,8\n2221#1:7712\n2344#1:7751\n2344#1:7752,8\n2344#1:7831\n2365#1:7833\n2365#1:7834,8\n2365#1:7913\n2386#1:7916\n2386#1:7917,8\n2386#1:7956\n508#1:5275,13\n2158#1:7368,13\n2536#1:7970,13\n539#1:5288,18\n2570#1:7983,18\n64#1:5394\n65#1:5395\n66#1:5396\n67#1:5397\n68#1:5398\n69#1:5399\n70#1:5400\n71#1:5401\n72#1:5402\n73#1:5403\n74#1:5404\n75#1:5405\n76#1:5406\n77#1:5407\n78#1:5408\n79#1:5409\n80#1:5410\n81#1:5411\n82#1:5412\n83#1:5413\n84#1:5414\n85#1:5415\n86#1:5416\n87#1:5417\n88#1:5418\n88#1:5419,2\n111#1:5421\n111#1:5422,2\n116#1:5424\n116#1:5425,2\n119#1:5427\n119#1:5428,2\n122#1:5430\n122#1:5431,2\n140#1:5433\n140#1:5434,2\n141#1:5436\n141#1:5437,2\n142#1:5439\n142#1:5440,2\n151#1:5442\n151#1:5443,2\n152#1:5445\n152#1:5446,2\n153#1:5448\n153#1:5449,2\n154#1:5451\n154#1:5452,2\n155#1:5454\n155#1:5455,2\n158#1:5457\n158#1:5458,2\n159#1:5460\n159#1:5461,2\n163#1:5463\n163#1:5464,2\n167#1:5466\n167#1:5467,2\n172#1:5469\n172#1:5470,2\n173#1:5472\n173#1:5473,2\n174#1:5475\n174#1:5476,2\n175#1:5478\n175#1:5479,2\n176#1:5481\n176#1:5482,2\n178#1:5484\n178#1:5485,2\n179#1:5487\n179#1:5488,2\n180#1:5490\n180#1:5491,2\n181#1:5493\n181#1:5494,2\n182#1:5496\n182#1:5497,2\n183#1:5499\n183#1:5500,2\n184#1:5502\n184#1:5503,2\n185#1:5505\n185#1:5506,2\n186#1:5508\n186#1:5509,2\n187#1:5511\n187#1:5512,2\n188#1:5514\n188#1:5515,2\n189#1:5517\n189#1:5518,2\n190#1:5520\n190#1:5521,2\n191#1:5523\n191#1:5524,2\n192#1:5526\n192#1:5527,2\n203#1:5529\n203#1:5530,2\n928#1:5653\n928#1:5654,2\n1485#1:6584\n1485#1:6585,2\n1486#1:6587\n1486#1:6588,2\n1827#1:7362\n1827#1:7363,2\n2080#1:7381\n2080#1:7382,2\n2106#1:7402\n2106#1:7403,2\n2132#1:7405\n2132#1:7406,2\n1144#1:5916,11\n1992#1:7009\n1992#1:7010,6\n*E\n"})
/* loaded from: BillingScreenKt.class */
public final class BillingScreenKt {

    @NotNull
    private static final List<CountryCodeItem> countryCodes = CollectionsKt.listOf(new CountryCodeItem[]{new CountryCodeItem("IN", "+91", "����", "India"), new CountryCodeItem("US", "+1", "����", "United States"), new CountryCodeItem("GB", "+44", "����", "United Kingdom"), new CountryCodeItem("AE", "+971", "����", "United Arab Emirates"), new CountryCodeItem("SA", "+966", "����", "Saudi Arabia"), new CountryCodeItem("QA", "+974", "����", "Qatar"), new CountryCodeItem("OM", "+968", "����", "Oman"), new CountryCodeItem("BH", "+973", "����", "Bahrain"), new CountryCodeItem("KW", "+965", "����", "Kuwait"), new CountryCodeItem("CA", "+1", "����", "Canada"), new CountryCodeItem("AU", "+61", "����", "Australia"), new CountryCodeItem("SG", "+65", "����", "Singapore"), new CountryCodeItem("MY", "+60", "����", "Malaysia"), new CountryCodeItem("PK", "+92", "����", "Pakistan"), new CountryCodeItem("BD", "+880", "����", "Bangladesh"), new CountryCodeItem("LK", "+94", "����", "Sri Lanka"), new CountryCodeItem("NP", "+977", "����", "Nepal"), new CountryCodeItem("DE", "+49", "����", "Germany"), new CountryCodeItem("FR", "+33", "����", "France"), new CountryCodeItem("IT", "+39", "����", "Italy"), new CountryCodeItem("ES", "+34", "����", "Spain"), new CountryCodeItem("NL", "+31", "����", "Netherlands"), new CountryCodeItem("CH", "+41", "����", "Switzerland"), new CountryCodeItem("SE", "+46", "����", "Sweden"), new CountryCodeItem("NO", "+47", "����", "Norway"), new CountryCodeItem("NZ", "+64", "����", "New Zealand"), new CountryCodeItem("ZA", "+27", "����", "South Africa"), new CountryCodeItem("JP", "+81", "����", "Japan"), new CountryCodeItem("CN", "+86", "����", "China")});

    private static final Unit BillingScreen$lambda$150(BillingViewModel $billingViewModel, UserProfile $user, int $$changed, int $$default, Composer $composer, int $force) {
        BillingScreen($billingViewModel, $user, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), $$default);
        return Unit.INSTANCE;
    }

    private static final Unit FlowCard_FHprtrg$lambda$1(Modifier $modifier, String $title, String $subtext, ImageVector $icon, long $iconColor, Function0 $onClick, int $$changed, int $$default, Composer $composer, int $force) {
        m0FlowCardFHprtrg($modifier, $title, $subtext, $icon, $iconColor, $onClick, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), $$default);
        return Unit.INSTANCE;
    }

    private static final Unit TableCard$lambda$5(TableItem $table, String $status, Double $orderTotal, int $orderItemsCount, Function0 $onClick, boolean $showBillDetails, boolean $showOrderStatus, String $currency, int $decimalPlaces, boolean $showKOTNoOnTable, boolean $displayTimeOnTable, Order $activeOrder, Long $activeTimestamp, boolean $isSelected, int $$changed, int $$changed1, int $$default, Composer $composer, int $force) {
        TableCard($table, $status, $orderTotal, $orderItemsCount, $onClick, $showBillDetails, $showOrderStatus, $currency, $decimalPlaces, $showKOTNoOnTable, $displayTimeOnTable, $activeOrder, $activeTimestamp, $isSelected, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), RecomposeScopeImplKt.updateChangedFlags($$changed1), $$default);
        return Unit.INSTANCE;
    }

    private static final Unit MenuItemCard$lambda$2(MenuItem $item, int $qtyInCart, int $punchedQty, Function0 $onAdd, Function0 $onRemove, boolean $isCompact, String $currency, boolean $showItemCodeDetails, int $decimalPlaces, boolean $showItemImage, boolean $showItemsDetails, boolean $showItemsPrepTime, int $$changed, int $$changed1, int $$default, Composer $composer, int $force) {
        MenuItemCard($item, $qtyInCart, $punchedQty, $onAdd, $onRemove, $isCompact, $currency, $showItemCodeDetails, $decimalPlaces, $showItemImage, $showItemsDetails, $showItemsPrepTime, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), RecomposeScopeImplKt.updateChangedFlags($$changed1), $$default);
        return Unit.INSTANCE;
    }

    private static final Unit ReceiptRow_6jM_SoI$lambda$1(String $label, String $value, boolean $isBold, long $color, long $fontSize, int $$changed, int $$default, Composer $composer, int $force) {
        m1ReceiptRow6jMSoI($label, $value, $isBold, $color, $fontSize, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), $$default);
        return Unit.INSTANCE;
    }

    private static final Unit ItemCustomizationDialog$lambda$8(MenuItem $item, List $optionGroups, Function0 $onDismiss, Function2 $onAdd, String $currency, int $$changed, Composer $composer, int $force) {
        ItemCustomizationDialog($item, $optionGroups, $onDismiss, $onAdd, $currency, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1));
        return Unit.INSTANCE;
    }

    private static final Unit CompactTextField_03iij_k$lambda$1(String $value, Function1 $onValueChange, String $placeholder, Modifier $modifier, KeyboardOptions $keyboardOptions, boolean $singleLine, long $fontSize, CornerBasedShape $shape, int $$changed, int $$default, Composer $composer, int $force) {
        m2CompactTextField03iij_k($value, $onValueChange, $placeholder, $modifier, $keyboardOptions, $singleLine, $fontSize, $shape, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), $$default);
        return Unit.INSTANCE;
    }

    private static final Unit ThermalGridRow$lambda$1(String $left, String $right, int $$changed, Composer $composer, int $force) {
        ThermalGridRow($left, $right, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1));
        return Unit.INSTANCE;
    }

    private static final Unit ThermalReceiptRow_JHQioms$lambda$1(String $label, String $value, boolean $isBold, long $fontSize, int $$changed, int $$default, Composer $composer, int $force) {
        m3ThermalReceiptRowJHQioms($label, $value, $isBold, $fontSize, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), $$default);
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$7(Function0 $onDismissRequest, Map $oldKotItems, BillingViewModel $billingViewModel, PosSettings $posSettings, Context $context, int $$changed, Composer $composer, int $force) {
        OldKotDialog($onDismissRequest, $oldKotItems, $billingViewModel, $posSettings, $context, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1));
        return Unit.INSTANCE;
    }

    private static final Unit SplitBillDialog$lambda$2(Function0 $onDismissRequest, Map $billingItems, PosSettings $posSettings, String $orderType, String $discountInput, String $serviceChargeInput, String $deliveryChargeInput, boolean $isComplimentaryOrder, Context $context, int $$changed, Composer $composer, int $force) {
        SplitBillDialog($onDismissRequest, $billingItems, $posSettings, $orderType, $discountInput, $serviceChargeInput, $deliveryChargeInput, $isComplimentaryOrder, $context, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1));
        return Unit.INSTANCE;
    }

    private static final Unit PaymentDialog$lambda$1(Function0 $onDismissRequest, Map $billingItems, String $discountInput, String $serviceChargeInput, String $deliveryChargeInput, PosSettings $posSettings, String $orderType, boolean $isComplimentaryOrder, String $advancePaidInput, String $paymentMethod, Function1 $onPaymentMethodChange, String $customerName, String $customerPhone, String $selectedDialCode, String $customerAddress, String $activeFlow, String $preOrderDate, String $preOrderTime, String $preOrderTypeInput, String $preOrderIdInput, TableItem $selectedTable, String $selectedWaiter, UserProfile $user, BillingViewModel $billingViewModel, Context $context, int $$changed, int $$changed1, int $$changed2, Composer $composer, int $force) {
        PaymentDialog($onDismissRequest, $billingItems, $discountInput, $serviceChargeInput, $deliveryChargeInput, $posSettings, $orderType, $isComplimentaryOrder, $advancePaidInput, $paymentMethod, $onPaymentMethodChange, $customerName, $customerPhone, $selectedDialCode, $customerAddress, $activeFlow, $preOrderDate, $preOrderTime, $preOrderTypeInput, $preOrderIdInput, $selectedTable, $selectedWaiter, $user, $billingViewModel, $context, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), RecomposeScopeImplKt.updateChangedFlags($$changed1), RecomposeScopeImplKt.updateChangedFlags($$changed2));
        return Unit.INSTANCE;
    }

    private static final Unit MenuSubTab$lambda$1(String $searchQuery, String $foodTypeFilter, Function1 $onFoodTypeFilterChange, String $selectedCategory, List $categories, boolean $isLoading, String $error, List $sortedItems, Map $cart, Map $oldKotItems, int $selectedPriceTier, String $currentOrderType, List $optionGroups, PosSettings $posSettings, BillingViewModel $billingViewModel, Function1 $onSelectItemForModifiers, Function1 $onActiveSubTabChange, int $$changed, int $$changed1, Composer $composer, int $force) {
        MenuSubTab($searchQuery, $foodTypeFilter, $onFoodTypeFilterChange, $selectedCategory, $categories, $isLoading, $error, $sortedItems, $cart, $oldKotItems, $selectedPriceTier, $currentOrderType, $optionGroups, $posSettings, $billingViewModel, $onSelectItemForModifiers, $onActiveSubTabChange, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), RecomposeScopeImplKt.updateChangedFlags($$changed1));
        return Unit.INSTANCE;
    }

    private static final Unit KotSubTab$lambda$2(Integer $editingOrderId, List $activeOrders, TableItem $selectedTable, Map $cart, Map $oldKotItems, String $activeFlow, String $preOrderDate, Function1 $onPreOrderDateChange, String $preOrderTime, Function1 $onPreOrderTimeChange, String $preOrderTypeInput, Function1 $onPreOrderTypeInputChange, String $customerName, Function1 $onCustomerNameChange, String $customerPhone, Function1 $onCustomerPhoneChange, String $selectedDialCode, Function1 $onSelectedDialCodeChange, String $customerAddress, Function1 $onCustomerAddressChange, String $selectedWaiter, PosSettings $posSettings, BillingViewModel $billingViewModel, UserProfile $user, Context $context, Function1 $onActiveSubTabChange, int $$changed, int $$changed1, int $$changed2, Composer $composer, int $force) {
        KotSubTab($editingOrderId, $activeOrders, $selectedTable, $cart, $oldKotItems, $activeFlow, $preOrderDate, $onPreOrderDateChange, $preOrderTime, $onPreOrderTimeChange, $preOrderTypeInput, $onPreOrderTypeInputChange, $customerName, $onCustomerNameChange, $customerPhone, $onCustomerPhoneChange, $selectedDialCode, $onSelectedDialCodeChange, $customerAddress, $onCustomerAddressChange, $selectedWaiter, $posSettings, $billingViewModel, $user, $context, $onActiveSubTabChange, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), RecomposeScopeImplKt.updateChangedFlags($$changed1), RecomposeScopeImplKt.updateChangedFlags($$changed2));
        return Unit.INSTANCE;
    }

    private static final Unit BillingSubTab$lambda$2(Map $billingItems, PosSettings $posSettings, String $orderType, String $discountInput, Function1 $onDiscountInputChange, String $serviceChargeInput, Function1 $onServiceChargeInputChange, String $deliveryChargeInput, Function1 $onDeliveryChargeInputChange, String $advancePaidInput, Function1 $onAdvancePaidInputChange, boolean $isComplimentaryOrder, Function1 $onIsComplimentaryOrderChange, String $customerName, String $customerPhone, String $customerAddress, String $preOrderDate, String $preOrderTime, String $preOrderTypeInput, Integer $editingOrderId, String $preOrderIdInput, String $activeFlow, TableItem $selectedTable, String $selectedWaiter, UserProfile $user, BillingViewModel $billingViewModel, Context $context, Function1 $onShowPaymentDialogChange, Function1 $onShowOldKotDialogChange, Function1 $onShowSplitBillDialogChange, Function1 $onShowPreviewDialogChange, Function1 $onShowDiscountDialogChange, Function1 $onShowChargesDialogChange, Function1 $onShowWaiterDialogChange, Function1 $onShowHistoryDialogChange, int $$changed, int $$changed1, int $$changed2, int $$changed3, Composer $composer, int $force) {
        BillingSubTab($billingItems, $posSettings, $orderType, $discountInput, $onDiscountInputChange, $serviceChargeInput, $onServiceChargeInputChange, $deliveryChargeInput, $onDeliveryChargeInputChange, $advancePaidInput, $onAdvancePaidInputChange, $isComplimentaryOrder, $onIsComplimentaryOrderChange, $customerName, $customerPhone, $customerAddress, $preOrderDate, $preOrderTime, $preOrderTypeInput, $editingOrderId, $preOrderIdInput, $activeFlow, $selectedTable, $selectedWaiter, $user, $billingViewModel, $context, $onShowPaymentDialogChange, $onShowOldKotDialogChange, $onShowSplitBillDialogChange, $onShowPreviewDialogChange, $onShowDiscountDialogChange, $onShowChargesDialogChange, $onShowWaiterDialogChange, $onShowHistoryDialogChange, $composer, RecomposeScopeImplKt.updateChangedFlags($$changed | 1), RecomposeScopeImplKt.updateChangedFlags($$changed1), RecomposeScopeImplKt.updateChangedFlags($$changed2), RecomposeScopeImplKt.updateChangedFlags($$changed3));
        return Unit.INSTANCE;
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    /* JADX WARN: Code restructure failed: missing block: B:380:0x28d7, code lost:
    
        if (r0 == null) goto L563;
     */
    /* JADX WARN: Code restructure failed: missing block: B:873:0x2835, code lost:
    
        if (r0 == null) goto L541;
     */
    /* JADX WARN: Removed duplicated region for block: B:247:0x1c1f  */
    /* JADX WARN: Removed duplicated region for block: B:254:0x1c80  */
    /* JADX WARN: Removed duplicated region for block: B:259:0x1cb7  */
    /* JADX WARN: Removed duplicated region for block: B:274:0x1d15  */
    /* JADX WARN: Removed duplicated region for block: B:280:0x1d27 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:284:0x1ba3 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:292:0x1c8d  */
    /* JADX WARN: Removed duplicated region for block: B:384:0x2a2d  */
    /* JADX WARN: Removed duplicated region for block: B:387:0x2a41  */
    /* JADX WARN: Removed duplicated region for block: B:390:0x2af0  */
    /* JADX WARN: Removed duplicated region for block: B:405:0x2db0  */
    /* JADX WARN: Removed duplicated region for block: B:492:0x637a  */
    /* JADX WARN: Removed duplicated region for block: B:515:0x38b4  */
    /* JADX WARN: Removed duplicated region for block: B:600:0x4111  */
    /* JADX WARN: Removed duplicated region for block: B:815:0x6312  */
    /* JADX WARN: Removed duplicated region for block: B:819:0x2b99  */
    /* JADX WARN: Removed duplicated region for block: B:858:0x2a4d  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final void BillingScreen(@org.jetbrains.annotations.NotNull com.example.sasloopmanager.BillingViewModel r43, @org.jetbrains.annotations.Nullable com.example.sasloopmanager.data.UserProfile r44, @org.jetbrains.annotations.Nullable androidx.compose.runtime.Composer r45, int r46, int r47) {
        /*
            Method dump skipped, instructions count: 25512
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, com.example.sasloopmanager.data.UserProfile, androidx.compose.runtime.Composer, int, int):void");
    }

    private static final List<MenuItem> BillingScreen$lambda$0(State<? extends List<MenuItem>> state) {
        return (List) state.getValue();
    }

    private static final List<CategoryItem> BillingScreen$lambda$1(State<? extends List<CategoryItem>> state) {
        return (List) state.getValue();
    }

    private static final String BillingScreen$lambda$2(State<String> state) {
        return (String) state.getValue();
    }

    private static final String BillingScreen$lambda$3(State<String> state) {
        return (String) state.getValue();
    }

    private static final Map<MenuItem, Integer> BillingScreen$lambda$4(State<? extends Map<MenuItem, Integer>> state) {
        return (Map) state.getValue();
    }

    private static final Map<MenuItem, Integer> BillingScreen$lambda$5(State<? extends Map<MenuItem, Integer>> state) {
        return (Map) state.getValue();
    }

    private static final List<TableItem> BillingScreen$lambda$6(State<? extends List<TableItem>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final List<Order> BillingScreen$lambda$7(State<? extends List<Order>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, String> BillingScreen$lambda$8(State<? extends Map<String, String>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, Long> BillingScreen$lambda$9(State<? extends Map<String, Long>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, Map<MenuItem, Integer>> BillingScreen$lambda$10(State<? extends Map<String, ? extends Map<MenuItem, Integer>>> state) {
        return (Map) state.getValue();
    }

    private static final CustomerHistoryResponse BillingScreen$lambda$11(State<CustomerHistoryResponse> state) {
        return (CustomerHistoryResponse) state.getValue();
    }

    private static final List<StaffUser> BillingScreen$lambda$12(State<? extends List<StaffUser>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final BillingFlowState BillingScreen$lambda$13(State<? extends BillingFlowState> state) {
        return (BillingFlowState) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$14(State<String> state) {
        return (String) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final TableItem BillingScreen$lambda$15(State<TableItem> state) {
        return (TableItem) state.getValue();
    }

    private static final boolean BillingScreen$lambda$16(State<Boolean> state) {
        return ((Boolean) state.getValue()).booleanValue();
    }

    private static final String BillingScreen$lambda$17(State<String> state) {
        return (String) state.getValue();
    }

    private static final Boolean BillingScreen$lambda$18(State<Boolean> state) {
        return (Boolean) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Integer BillingScreen$lambda$19(State<Integer> state) {
        return (Integer) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final PosSettings BillingScreen$lambda$20(State<PosSettings> state) {
        return (PosSettings) state.getValue();
    }

    private static final List<OptionGroup> BillingScreen$lambda$21(State<? extends List<OptionGroup>> state) {
        return (List) state.getValue();
    }

    private static final int BillingScreen$lambda$22(State<Integer> state) {
        return ((Number) state.getValue()).intValue();
    }

    private static final String BillingScreen$lambda$23(State<String> state) {
        return (String) state.getValue();
    }

    private static final MenuItem BillingScreen$lambda$25(MutableState<MenuItem> mutableState) {
        return (MenuItem) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$30(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$33(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$36(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$39(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$42(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$45(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$48(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$51(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$54(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$57(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$60(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$63(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$66(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$69(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$72(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$75(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$78(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$81(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$87(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final boolean BillingScreen$lambda$90(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$91(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final void BillingScreen$lambda$94(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final void BillingScreen$lambda$97(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final void BillingScreen$lambda$100(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final void BillingScreen$lambda$103(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final void BillingScreen$lambda$106(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$114(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$115(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$117(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$118(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$120(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void BillingScreen$lambda$121(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final String BillingScreen$lambda$126(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$129(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final String BillingScreen$lambda$132(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final boolean BillingScreen$lambda$139(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void BillingScreen$lambda$140(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final Unit BillingScreen$lambda$146$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit BillingScreen$lambda$148(long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C319@16082L62:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1849796314, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous> (BillingScreen.kt:319)");
            }
            TextKt.Text-Nvy7gAk("POS Order processed successfully!", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$147$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit BillingScreen$lambda$147(BillingViewModel $billingViewModel, Composer $composer, int $changed) {
        Object obj;
        ComposerKt.sourceInformation($composer, "C322@16236L40,323@16322L41,321@16194L268:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1536504737, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous> (BillingScreen.kt:321)");
            }
            ComposerKt.sourceInformationMarkerStart($composer, -887695607, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj2 = () -> {
                    return BillingScreen$lambda$147$0$0(r0);
                };
                $composer.updateRememberedValue(obj2);
                obj = obj2;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.TextButton((Function0) obj, (Modifier) null, false, (Shape) null, ButtonDefaults.INSTANCE.textButtonColors-ro_MJ88(0L, ColorKt.getSaSGreen(), 0L, 0L, $composer, ButtonDefaults.$stable << 12, 13), (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$932245662$app(), $composer, 805306368, 494);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.goBack();
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit BillingScreen$lambda$149$0$0$0$1(long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C353@17469L90:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1798388617, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:353)");
            }
            IconKt.Icon-ww6aTOc(ArrowBackKt.getArrowBack(Icons.INSTANCE.getDefault()), "Back", SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), $TextPrimary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.fetchTablesAndActiveOrders();
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.loadCatalogAndCategories();
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$0$1$2$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearCart();
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$1$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("DINEIN");
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$1$0$0$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("TAKEAWAY_DELIVERY");
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$1$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("QUICK_BILL");
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$1$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("PREORDER");
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$5$0$0(List $departments, MutableState $selectedDepartment$delegate, long $InputDark, long $TextSecondary, long $CardBorderDark, LazyListScope $this$LazyRow) {
        Intrinsics.checkNotNullParameter($this$LazyRow, "$this$LazyRow");
        $this$LazyRow.items($departments.size(), (Function1) null, new BillingScreenKt$BillingScreen$lambda$149$0$5$0$0$.inlined.items.default.3(BillingScreenKt$BillingScreen$lambda$149$0$5$0$0$.inlined.items.default.1.INSTANCE, $departments), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$BillingScreen$lambda$149$0$5$0$0$.inlined.items.default.4($departments, $selectedDepartment$delegate, $InputDark, $TextSecondary, $CardBorderDark)));
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$5$1$0(List $filteredTables, BillingViewModel $billingViewModel, State $activeOrders$delegate, State $tableCarts$delegate, State $tableStatuses$delegate, State $tableActiveTimestamps$delegate, State $posSettings$delegate, State $selectedTable$delegate, LazyGridScope $this$LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter($this$LazyVerticalGrid, "$this$LazyVerticalGrid");
        $this$LazyVerticalGrid.items($filteredTables.size(), (Function1) null, (Function2) null, new BillingScreenKt$BillingScreen$lambda$149$0$5$1$0$.inlined.items.default.4(BillingScreenKt$BillingScreen$lambda$149$0$5$1$0$.inlined.items.default.1.INSTANCE, $filteredTables), ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new BillingScreenKt$BillingScreen$lambda$149$0$5$1$0$.inlined.items.default.5($filteredTables, $billingViewModel, $activeOrders$delegate, $tableCarts$delegate, $tableStatuses$delegate, $tableActiveTimestamps$delegate, $posSettings$delegate, $selectedTable$delegate)));
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit BillingScreen$lambda$149$0$6$0(MutableState $activeSubTab$delegate, long $TextSecondary, State $cart$delegate, Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        ComposerKt.sourceInformation($composer, "C642@35418L25,643@35484L411,640@35301L624,654@36071L28,655@36140L1749,652@35954L1965:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-310271094, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:640)");
            }
            boolean z = !Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING");
            ComposerKt.sourceInformationMarkerStart($composer, -1817773181, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($activeSubTab$delegate);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                boolean z2 = z;
                Object obj3 = () -> {
                    return BillingScreen$lambda$149$0$6$0$0$0(r0);
                };
                z = z2;
                $composer.updateRememberedValue(obj3);
                obj = obj3;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z, (Function0) obj, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(1537569892, true, (v2, v3) -> {
                return BillingScreen$lambda$149$0$6$0$1(r6, r7, v2, v3);
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24576, 492);
            boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING");
            ComposerKt.sourceInformationMarkerStart($composer, -1817752282, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed2 = $composer.changed($activeSubTab$delegate);
            Object rememberedValue2 = $composer.rememberedValue();
            if (changed2 || rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj4 = () -> {
                    return BillingScreen$lambda$149$0$6$0$2$0(r0);
                };
                areEqual = areEqual;
                $composer.updateRememberedValue(obj4);
                obj2 = obj4;
            } else {
                obj2 = rememberedValue2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(areEqual, (Function0) obj2, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(-2001796403, true, (v3, v4) -> {
                return BillingScreen$lambda$149$0$6$0$3(r6, r7, r8, v3, v4);
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24576, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$0$0$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("MENU");
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit BillingScreen$lambda$149$0$6$0$1(long $TextSecondary, MutableState $activeSubTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C644@35522L339:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1537569892, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:644)");
            }
            FontWeight bold = FontWeight.Companion.getBold();
            TextKt.Text-Nvy7gAk("Menu / KOT", (Modifier) null, !Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING") ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, bold, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$0$2$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("BILLING");
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit BillingScreen$lambda$149$0$6$0$3(long $TextSecondary, MutableState $activeSubTab$delegate, State $cart$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C656@36178L1677:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2001796403, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:656)");
            }
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, (14 & (384 >> 3)) | (112 & (384 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (384 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (384 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -1349754359, "C657@36272L365:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("Billing & Settle", (Modifier) null, Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING") ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            int sumOfInt = CollectionsKt.sumOfInt(BillingScreen$lambda$4($cart$delegate).values());
            if (sumOfInt <= 0) {
                $composer.startReplaceGroup(-1348269615);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1349272899);
                ComposerKt.sourceInformation($composer, "665@36819L28,670@37162L613,666@36892L883");
                SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(6)), $composer, 6);
                SurfaceKt.Surface-T9BRK9s(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16)), RoundedCornerShapeKt.getCircleShape(), ColorKt.getSaSGreen(), 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(-1798027161, true, (v1, v2) -> {
                    return BillingScreen$lambda$149$0$6$0$3$0$0(r9, v1, v2);
                }, $composer, 54), $composer, 12582918, 120);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit BillingScreen$lambda$149$0$6$0$3$0$0(int $totalItems, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C671@37212L517:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1798027161, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:671)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1192304910, "C672@37307L372:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(String.valueOf($totalItems), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$1$0(MutableState $discountInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $discountInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$2$0(MutableState $serviceChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $serviceChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$3$0(MutableState $deliveryChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $deliveryChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$4$0(MutableState $advancePaidInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $advancePaidInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$5$0(MutableState $isComplimentaryOrder$delegate, boolean it) {
        BillingScreen$lambda$91($isComplimentaryOrder$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$6$0(MutableState $showPaymentDialog$delegate, boolean it) {
        BillingScreen$lambda$115($showPaymentDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$7$0(MutableState $showOldKotDialog$delegate, boolean it) {
        BillingScreen$lambda$118($showOldKotDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$8$0(MutableState $showSplitBillDialog$delegate, boolean it) {
        BillingScreen$lambda$121($showSplitBillDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$9$0(MutableState $showPreviewDialog$delegate, boolean it) {
        BillingScreen$lambda$106($showPreviewDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$10$0(MutableState $showDiscountDialog$delegate, boolean it) {
        BillingScreen$lambda$94($showDiscountDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$11$0(MutableState $showChargesDialog$delegate, boolean it) {
        BillingScreen$lambda$97($showChargesDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$12$0(MutableState $showWaiterDialog$delegate, boolean it) {
        BillingScreen$lambda$100($showWaiterDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$13$0(MutableState $showHistoryDialog$delegate, boolean it) {
        BillingScreen$lambda$103($showHistoryDialog$delegate, it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$0$0$0(MutableState $foodTypeFilter$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $foodTypeFilter$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$0$1$0(MutableState $selectedItemForModifiers$delegate, MenuItem it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $selectedItemForModifiers$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$0$2$0(MutableState $activeSubTab$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $activeSubTab$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$0$0(MutableState $preOrderDate$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $preOrderDate$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$1$0(MutableState $preOrderTime$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $preOrderTime$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$2$0(MutableState $preOrderTypeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $preOrderTypeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$3$0(MutableState $customerName$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerName$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$4$0(MutableState $customerPhone$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerPhone$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$5$0(MutableState $selectedDialCode$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $selectedDialCode$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$6$0(MutableState $customerAddress$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerAddress$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$14$1$7$0(MutableState $activeSubTab$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $activeSubTab$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$15$0(MutableState $showPaymentDialog$delegate) {
        BillingScreen$lambda$115($showPaymentDialog$delegate, false);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$16$0(MutableState $paymentMethod$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $paymentMethod$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$17$0(MutableState $selectedItemForModifiers$delegate) {
        $selectedItemForModifiers$delegate.setValue(null);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$18$0(BillingViewModel $billingViewModel, MenuItem $itemForModifiers, MutableState $selectedItemForModifiers$delegate, List selected, String note) {
        Intrinsics.checkNotNullParameter(selected, "selected");
        Intrinsics.checkNotNullParameter(note, "note");
        $billingViewModel.addCustomItemToCart($itemForModifiers, selected, note);
        $selectedItemForModifiers$delegate.setValue(null);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$19$0(MutableState $showOldKotDialog$delegate) {
        BillingScreen$lambda$118($showOldKotDialog$delegate, false);
        return Unit.INSTANCE;
    }

    private static final Unit BillingScreen$lambda$149$0$6$20$0(MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$121($showSplitBillDialog$delegate, false);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: FlowCard-FHprtrg, reason: not valid java name */
    private static final void m0FlowCardFHprtrg(Modifier modifier, String title, String subtext, ImageVector icon, long iconColor, Function0<Unit> function0, Composer $composer, int $changed, int i) {
        Composer $composer2 = $composer.startRestartGroup(-589557774);
        ComposerKt.sourceInformation($composer2, "C(FlowCard)N(modifier,title,subtext,icon,iconColor:c#ui.graphics.Color,onClick)870@48284L11,871@48340L11,872@48398L11,879@48610L38,881@48705L890,874@48432L1163:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if ((i & 1) != 0) {
            $dirty |= 6;
        } else if (($changed & 6) == 0) {
            $dirty |= $composer2.changed(modifier) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(title) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changed(subtext) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(icon) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changed(iconColor) ? 16384 : 8192;
        }
        if (($changed & 196608) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 131072 : 65536;
        }
        if (!$composer2.shouldExecute(($dirty & 74899) != 74898, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if ((i & 1) != 0) {
                modifier = (Modifier) Modifier.Companion;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-589557774, $dirty, -1, "com.example.sasloopmanager.FlowCard (BillingScreen.kt:869)");
            }
            long cardColor = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface-0d7_KjU();
            long borderColor = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            long textSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            CardKt.Card(ClickableKt.clickable-oSLSa3U$default(SizeKt.height-3ABfNKs(modifier, Dp.constructor-impl(130)), false, (String) null, (Role) null, (MutableInteractionSource) null, function0, 15, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88(cardColor, 0L, 0L, 0L, $composer2, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), borderColor), ComposableLambdaKt.rememberComposableLambda(1976965988, true, (v5, v6, v7) -> {
                return FlowCard_FHprtrg$lambda$0(r7, r8, r9, r10, r11, v5, v6, v7);
            }, $composer2, 54), $composer2, 196608, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            Modifier modifier2 = modifier;
            endRestartGroup.updateScope((v8, v9) -> {
                return FlowCard_FHprtrg$lambda$1(r1, r2, r3, r4, r5, r6, r7, r8, v8, v9);
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit FlowCard_FHprtrg$lambda$0(long $iconColor, ImageVector $icon, String $title, String $subtext, long $textSecondary, ColumnScope $this$Card, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C882@48715L874:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1976965988, $changed, -1, "com.example.sasloopmanager.FlowCard.<anonymous> (BillingScreen.kt:882)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(14));
            Arrangement.Vertical spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(spaceBetween, Alignment.Companion.getStart(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (54 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1259130532, "C888@48902L356,897@49271L308:BillingScreen.kt#7ez3px");
            Modifier modifier2 = BackgroundKt.background-bw27NRU$default(ClipKt.clip(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(36)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(10))), Color.copy-wmQWz5c$default($iconColor, 0.15f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (Shape) null, 2, (Object) null);
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor2);
            } else {
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i6 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -611467776, "C895@49177L67:BillingScreen.kt#7ez3px");
            IconKt.Icon-ww6aTOc($icon, (String) null, SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20)), $iconColor, $composer, 432, 0);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier3 = Modifier.Companion;
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier3);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = 6 | (896 & ((112 & (0 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor3);
            } else {
                $composer.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer);
            Updater.set-impl(composer3, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = 14 & (i7 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            int i9 = 6 | (112 & (0 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1420085254, "C898@49330L11,898@49296L104,899@49417L29,900@49463L102:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk($title, (Modifier) null, MaterialTheme.INSTANCE.getColorScheme($composer, MaterialTheme.$stable).getOnSurface-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
            SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(3)), $composer, 6);
            TextKt.Text-Nvy7gAk($subtext, (Modifier) null, $textSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, TextOverflow.Companion.getEllipsis-gIe3tQ8(), false, 1, 0, (Function1) null, (TextStyle) null, $composer, 24576, 24960, 241642);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void TableCard(TableItem table, String status, Double orderTotal, int orderItemsCount, Function0<Unit> function0, boolean showBillDetails, boolean showOrderStatus, String currency, int decimalPlaces, boolean showKOTNoOnTable, boolean displayTimeOnTable, Order activeOrder, Long activeTimestamp, boolean isSelected, Composer $composer, int $changed, int $changed1, int i) {
        Object obj;
        long tableStatusAvailable;
        String str;
        BorderStroke borderStroke;
        Object obj2;
        Composer $composer2 = $composer.startRestartGroup(1790144612);
        ComposerKt.sourceInformation($composer2, "C(TableCard)N(table,status,orderTotal,orderItemsCount,onClick,showBillDetails,showOrderStatus,currency,decimalPlaces,showKOTNoOnTable,displayTimeOnTable,activeOrder,activeTimestamp,isSelected)927@50241L30,973@51665L38,975@51741L4617,967@51459L4899:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int $dirty1 = $changed1;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changed(table) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(status) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changed(orderTotal) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(orderItemsCount) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 16384 : 8192;
        }
        if (($changed & 196608) == 0) {
            $dirty |= $composer2.changed(showBillDetails) ? 131072 : 65536;
        }
        if (($changed & 1572864) == 0) {
            $dirty |= $composer2.changed(showOrderStatus) ? 1048576 : 524288;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= $composer2.changed(currency) ? 8388608 : 4194304;
        }
        if (($changed & 100663296) == 0) {
            $dirty |= $composer2.changed(decimalPlaces) ? 67108864 : 33554432;
        }
        if (($changed & 805306368) == 0) {
            $dirty |= $composer2.changed(showKOTNoOnTable) ? 536870912 : 268435456;
        }
        if (($changed1 & 6) == 0) {
            $dirty1 |= $composer2.changed(displayTimeOnTable) ? 4 : 2;
        }
        if (($changed1 & 48) == 0) {
            $dirty1 |= ($changed1 & 64) == 0 ? $composer2.changed(activeOrder) : $composer2.changedInstance(activeOrder) ? 32 : 16;
        }
        if (($changed1 & 384) == 0) {
            $dirty1 |= $composer2.changed(activeTimestamp) ? 256 : 128;
        }
        if ((i & 8192) != 0) {
            $dirty1 |= 3072;
        } else if (($changed1 & 3072) == 0) {
            $dirty1 |= $composer2.changed(isSelected) ? 2048 : 1024;
        }
        if (!$composer2.shouldExecute((($dirty & 306783379) == 306783378 && ($dirty1 & 1171) == 1170) ? false : true, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if ((i & 8192) != 0) {
                isSelected = false;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1790144612, $dirty, $dirty1, "com.example.sasloopmanager.TableCard (BillingScreen.kt:923)");
            }
            String statusUpper = status.toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(statusUpper, "toUpperCase(...)");
            boolean isOccupied = (Intrinsics.areEqual(statusUpper, "AVAILABLE") || Intrinsics.areEqual(statusUpper, "VACANT")) ? false : true;
            ComposerKt.sourceInformationMarkerStart($composer2, -1952895678, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer2.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                Object mutableStateOf$default = SnapshotStateKt.mutableStateOf$default(0, (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer2.updateRememberedValue(mutableStateOf$default);
                obj = mutableStateOf$default;
            } else {
                obj = rememberedValue;
            }
            MutableState ticks$delegate = (MutableState) obj;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (displayTimeOnTable && activeTimestamp != null && activeTimestamp.longValue() > 0) {
                $composer2.startReplaceGroup(-410111900);
                ComposerKt.sourceInformation($composer2, "929@50392L106,929@50360L138");
                Long l = activeTimestamp;
                ComposerKt.sourceInformationMarkerStart($composer2, -1952890770, "CC(remember):BillingScreen.kt#9igjgp");
                Object rememberedValue2 = $composer2.rememberedValue();
                if (rememberedValue2 == Composer.Companion.getEmpty()) {
                    Object obj3 = (Function2) new TableCard.1.1(ticks$delegate, (Continuation) null);
                    l = l;
                    $composer2.updateRememberedValue(obj3);
                    obj2 = obj3;
                } else {
                    obj2 = rememberedValue2;
                }
                ComposerKt.sourceInformationMarkerEnd($composer2);
                EffectsKt.LaunchedEffect(l, (Function2) obj2, $composer2, 14 & ($dirty1 >> 6));
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(-409963906);
                $composer2.endReplaceGroup();
            }
            switch (statusUpper.hashCode()) {
                case -1226282194:
                    if (statusUpper.equals("DRAFT_PRINTED")) {
                        tableStatusAvailable = ColorKt.getTableStatusDraftPrinted();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 78673511:
                    if (statusUpper.equals("SAVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusSaved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 403264492:
                    if (statusUpper.equals("PRINTED")) {
                        tableStatusAvailable = ColorKt.getTableStatusPrinted();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 432241448:
                    if (statusUpper.equals("RESERVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusReserved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 1301183189:
                    if (statusUpper.equals("ITEMS_IN_KOT")) {
                        tableStatusAvailable = ColorKt.getTableStatusItemsInKot();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 1953666095:
                    if (statusUpper.equals("BILL_SAVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusBillSaved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 2016941524:
                    if (statusUpper.equals("ORDERING")) {
                        tableStatusAvailable = ColorKt.getTableStatusOrdering();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                default:
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
            }
            long statusColor = tableStatusAvailable;
            switch (statusUpper.hashCode()) {
                case -1226282194:
                    if (statusUpper.equals("DRAFT_PRINTED")) {
                        str = "DRAFT PRINTED";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 1301183189:
                    if (statusUpper.equals("ITEMS_IN_KOT")) {
                        str = "ITEMS IN KOT";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 1953666095:
                    if (statusUpper.equals("BILL_SAVED")) {
                        str = "BILL SAVED";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 2052692649:
                    if (statusUpper.equals("AVAILABLE")) {
                        str = "VACANT";
                        break;
                    }
                    str = statusUpper;
                    break;
                default:
                    str = statusUpper;
                    break;
            }
            String displayStatus = str;
            long borderColor = Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.15f, 0.0f, 0.0f, 0.0f, 14, (Object) null);
            long badgeBgColor = Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.2f, 0.0f, 0.0f, 0.0f, 14, (Object) null);
            long badgeTextColor = Color.Companion.getWhite-0d7_KjU();
            if (isSelected) {
                borderStroke = BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(3), androidx.compose.ui.graphics.ColorKt.Color(4294286859L));
            } else {
                borderStroke = BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), borderColor);
            }
            BorderStroke borderStroke2 = borderStroke;
            CardKt.Card(ClickableKt.clickable-oSLSa3U$default(SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(105)), false, (String) null, (Role) null, (MutableInteractionSource) null, function0, 15, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88(statusColor, 0L, 0L, 0L, $composer2, CardDefaults.$stable << 12, 14), (CardElevation) null, borderStroke2, ComposableLambdaKt.rememberComposableLambda(526908246, true, (v16, v17, v18) -> {
                return TableCard$lambda$4(r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, v16, v17, v18);
            }, $composer2, 54), $composer2, 196608, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            boolean z = isSelected;
            endRestartGroup.updateScope((v17, v18) -> {
                return TableCard$lambda$5(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, v17, v18);
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final int TableCard$lambda$1(MutableState<Integer> mutableState) {
        return ((Number) ((State) mutableState).getValue()).intValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void TableCard$lambda$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit TableCard$lambda$4(boolean $isOccupied, Double $orderTotal, boolean $showBillDetails, TableItem $table, boolean $displayTimeOnTable, Long $activeTimestamp, boolean $showKOTNoOnTable, Order $activeOrder, boolean $showOrderStatus, long $badgeBgColor, MutableState $ticks$delegate, String $displayStatus, long $badgeTextColor, int $orderItemsCount, String $currency, int $decimalPlaces, ColumnScope $this$Card, Composer $composer, int $changed) {
        Object obj;
        String str;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C976@51751L4601:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(526908246, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous> (BillingScreen.kt:976)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(Alignment.Companion.getTopStart(), false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (6 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (6 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 433053780, "C981@51875L4467:BillingScreen.kt#7ez3px");
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Vertical spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(spaceBetween, Alignment.Companion.getStart(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, fillMaxSize$default);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor2);
            } else {
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i6 = 6 | (112 & (54 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -966545466, "C985@52029L3245:BillingScreen.kt#7ez3px");
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween2 = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween2, centerVertically, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor3);
            } else {
                $composer.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer);
            Updater.set-impl(composer3, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = 14 & (i7 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i9 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1276000448, "C990@52267L216,997@52505L2751:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk($table.getTableName(), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(15), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            Arrangement.Horizontal horizontal = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(4));
            Alignment.Vertical centerVertically2 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier2 = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(horizontal, centerVertically2, $composer, (14 & (432 >> 3)) | (112 & (432 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
            int i10 = 6 | (896 & ((112 & (432 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor4);
            } else {
                $composer.useNode();
            }
            Composer composer4 = Updater.constructor-impl($composer);
            Updater.set-impl(composer4, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
            int i11 = 14 & (i10 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope2 = RowScopeInstance.INSTANCE;
            int i12 = 6 | (112 & (432 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -345286744, "C:BillingScreen.kt#7ez3px");
            if (!$displayTimeOnTable || $activeTimestamp == null || $activeTimestamp.longValue() <= 0) {
                $composer.startReplaceGroup(-344298744);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-345260705);
                ComposerKt.sourceInformation($composer, "1002@52826L157,1009@53320L434,1006@53143L611");
                long longValue = $activeTimestamp.longValue();
                int TableCard$lambda$1 = TableCard$lambda$1($ticks$delegate);
                ComposerKt.sourceInformationMarkerStart($composer, 1235789207, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = $composer.changed(longValue) | $composer.changed(TableCard$lambda$1);
                Object rememberedValue = $composer.rememberedValue();
                if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                    Object valueOf = Long.valueOf((System.currentTimeMillis() - $activeTimestamp.longValue()) / 60000);
                    $composer.updateRememberedValue(valueOf);
                    obj = valueOf;
                } else {
                    obj = rememberedValue;
                }
                long longValue2 = ((Number) obj).longValue();
                ComposerKt.sourceInformationMarkerEnd($composer);
                if (longValue2 >= 60) {
                    long j = longValue2 / 60;
                    long j2 = longValue2 % 60;
                    str = j + "h " + j + "m";
                } else {
                    str = longValue2 + "m";
                }
                String str2 = str;
                SurfaceKt.Surface-T9BRK9s((Modifier) null, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(6)), Color.copy-wmQWz5c$default(Color.Companion.getBlack-0d7_KjU(), 0.25f, 0.0f, 0.0f, 0.0f, 14, (Object) null), 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(-527706672, true, (v1, v2) -> {
                    return TableCard$lambda$4$0$0$0$0$1(r9, v1, v2);
                }, $composer, 54), $composer, 12583296, 121);
                $composer.endReplaceGroup();
            }
            if (!$showKOTNoOnTable || $activeOrder == null) {
                $composer.startReplaceGroup(-343552760);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-344207201);
                ComposerKt.sourceInformation($composer, "1024@54058L448,1021@53881L625");
                SurfaceKt.Surface-T9BRK9s((Modifier) null, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(6)), Color.copy-wmQWz5c$default(Color.Companion.getBlack-0d7_KjU(), 0.25f, 0.0f, 0.0f, 0.0f, 14, (Object) null), 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(-1243044025, true, (v1, v2) -> {
                    return TableCard$lambda$4$0$0$0$0$2(r9, v1, v2);
                }, $composer, 54), $composer, 12583296, 121);
                $composer.endReplaceGroup();
            }
            if (!$showOrderStatus) {
                $composer.startReplaceGroup(-342856376);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-343485831);
                ComposerKt.sourceInformation($composer, "1039@54768L440,1036@54609L599");
                SurfaceKt.Surface-T9BRK9s((Modifier) null, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(6)), $badgeBgColor, 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(1696422856, true, (v2, v3) -> {
                    return TableCard$lambda$4$0$0$0$0$3(r9, r10, v2, v3);
                }, $composer, 54), $composer, 12583296, 121);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (!$isOccupied || $orderTotal == null || !$showBillDetails) {
                $composer.startReplaceGroup(-962722206);
                ComposerKt.sourceInformation($composer, "1067@56008L302");
                String departmentName = $table.getDepartmentName();
                if (departmentName == null) {
                    departmentName = "General Section";
                }
                TextKt.Text-Nvy7gAk(departmentName, (Modifier) null, Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.7f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, TextOverflow.Companion.getEllipsis-gIe3tQ8(), false, 1, 0, (Function1) null, (TextStyle) null, $composer, 24960, 24960, 241642);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-963365735);
                ComposerKt.sourceInformation($composer, "1053@55371L591");
                ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                Modifier modifier3 = Modifier.Companion;
                MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap5 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer, modifier3);
                Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                int i13 = 6 | (896 & ((112 & (0 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor5);
                } else {
                    $composer.useNode();
                }
                Composer composer5 = Updater.constructor-impl($composer);
                Updater.set-impl(composer5, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                int i14 = 14 & (i13 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
                int i15 = 6 | (112 & (0 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer, -1833359000, "C1054@55404L207,1059@55636L304:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk($orderItemsCount + " item(s)", (Modifier) null, Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.7f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24960, 0, 262122);
                StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                Object[] objArr = {$orderTotal};
                String format = String.format(Locale.US, "%." + $decimalPlaces + "f", Arrays.copyOf(objArr, objArr.length));
                Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                TextKt.Text-Nvy7gAk($currency + " " + format, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit TableCard$lambda$4$0$0$0$0$1(String $elapsedStr, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1010@53354L370:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-527706672, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1010)");
            }
            TextKt.Text-Nvy7gAk($elapsedStr, PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(5), Dp.constructor-impl(2)), Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit TableCard$lambda$4$0$0$0$0$2(Order $activeOrder, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1025@54092L384:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1243044025, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1025)");
            }
            TextKt.Text-Nvy7gAk("KOT #" + $activeOrder.getId(), PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(5), Dp.constructor-impl(2)), Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit TableCard$lambda$4$0$0$0$0$3(String $displayStatus, long $badgeTextColor, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1040@54802L376:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1696422856, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1040)");
            }
            TextKt.Text-Nvy7gAk($displayStatus, PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(6), Dp.constructor-impl(3)), $badgeTextColor, (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Removed duplicated region for block: B:124:0x039d  */
    /* JADX WARN: Removed duplicated region for block: B:131:0x03ef  */
    /* JADX WARN: Removed duplicated region for block: B:134:0x03ff  */
    /* JADX WARN: Removed duplicated region for block: B:139:0x0410  */
    /* JADX WARN: Removed duplicated region for block: B:148:0x043d  */
    /* JADX WARN: Removed duplicated region for block: B:153:0x0520  */
    /* JADX WARN: Removed duplicated region for block: B:161:0x0487  */
    /* JADX WARN: Removed duplicated region for block: B:165:0x03f5  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final void MenuItemCard(com.example.sasloopmanager.data.MenuItem r38, int r39, int r40, kotlin.jvm.functions.Function0<kotlin.Unit> r41, kotlin.jvm.functions.Function0<kotlin.Unit> r42, boolean r43, java.lang.String r44, boolean r45, int r46, boolean r47, boolean r48, boolean r49, androidx.compose.runtime.Composer r50, int r51, int r52, int r53) {
        /*
            Method dump skipped, instructions count: 1377
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.MenuItemCard(com.example.sasloopmanager.data.MenuItem, int, int, kotlin.jvm.functions.Function0, kotlin.jvm.functions.Function0, boolean, java.lang.String, boolean, int, boolean, boolean, boolean, androidx.compose.runtime.Composer, int, int, int):void");
    }

    /* JADX WARN: Code restructure failed: missing block: B:122:0x11fd, code lost:
    
        if (r0 == null) goto L129;
     */
    /* JADX WARN: Removed duplicated region for block: B:134:0x134a  */
    /* JADX WARN: Removed duplicated region for block: B:147:0x152a  */
    /* JADX WARN: Removed duplicated region for block: B:150:0x153e  */
    /* JADX WARN: Removed duplicated region for block: B:153:0x1658  */
    /* JADX WARN: Removed duplicated region for block: B:208:0x1db2  */
    /* JADX WARN: Removed duplicated region for block: B:213:0x154a  */
    /* JADX WARN: Removed duplicated region for block: B:222:0x143e  */
    /* JADX WARN: Removed duplicated region for block: B:57:0x0a09  */
    /* JADX WARN: Removed duplicated region for block: B:66:0x0bb4  */
    @androidx.compose.runtime.ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @androidx.compose.runtime.Composable
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private static final kotlin.Unit MenuItemCard$lambda$1(boolean r27, float r28, boolean r29, java.lang.String r30, com.example.sasloopmanager.data.MenuItem r31, long r32, int r34, int r35, boolean r36, kotlin.jvm.functions.Function0 r37, java.lang.String r38, int r39, boolean r40, boolean r41, float r42, long r43, long r45, boolean r47, long r48, float r50, long r51, kotlin.jvm.functions.Function0 r53, long r54, float r56, androidx.compose.foundation.layout.ColumnScope r57, androidx.compose.runtime.Composer r58, int r59) {
        /*
            Method dump skipped, instructions count: 7884
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.MenuItemCard$lambda$1(boolean, float, boolean, java.lang.String, com.example.sasloopmanager.data.MenuItem, long, int, int, boolean, kotlin.jvm.functions.Function0, java.lang.String, int, boolean, boolean, float, long, long, boolean, long, float, long, kotlin.jvm.functions.Function0, long, float, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit MenuItemCard$lambda$1$0$1(int $totalQty, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1208@61819L348:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1106993098, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1208)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1791748588, "C1209@61890L251:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(String.valueOf($totalQty), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit MenuItemCard$lambda$1$0$2(int $resolvedPrepTime, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1229@62833L337:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(988842453, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1229)");
            }
            TextKt.Text-Nvy7gAk("�� " + $resolvedPrepTime + "m", PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(4), Dp.constructor-impl(2)), Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit MenuItemCard$lambda$1$0$4$0(Function0 $onAdd) {
        $onAdd.invoke();
        return Unit.INSTANCE;
    }

    private static final Unit MenuItemCard$lambda$1$1$3$0$0$0(Function0 $onRemove) {
        $onRemove.invoke();
        return Unit.INSTANCE;
    }

    private static final Unit MenuItemCard$lambda$1$1$3$0$2$0(Function0 $onAdd) {
        $onAdd.invoke();
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit MenuItemCard$lambda$1$1$3$1(boolean $isCompact, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C1429@72046L105:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1865522651, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1429)");
            }
            TextKt.Text-Nvy7gAk("Add", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, $isCompact ? TextUnitKt.getSp(9) : TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1573254, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final String formatPrice(double price, PosSettings posSettings) {
        StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
        Locale locale = Locale.US;
        String str = "%." + posSettings.getDecimalPlaces() + "f";
        Object[] objArr = {Double.valueOf(price)};
        String format = String.format(locale, str, Arrays.copyOf(objArr, objArr.length));
        Intrinsics.checkNotNullExpressionValue(format, "format(...)");
        return format;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: ReceiptRow-6jM-SoI, reason: not valid java name */
    public static final void m1ReceiptRow6jMSoI(@NotNull String label, @NotNull String value, boolean isBold, long color, long fontSize, @Nullable Composer $composer, int $changed, int i) {
        long j;
        Intrinsics.checkNotNullParameter(label, "label");
        Intrinsics.checkNotNullParameter(value, "value");
        Composer $composer2 = $composer.startRestartGroup(1071795232);
        ComposerKt.sourceInformation($composer2, "C(ReceiptRow)N(label,value,isBold,color:c#ui.graphics.Color,fontSize:c#ui.unit.TextUnit)1450@72678L11,1451@72738L11,1456@72897L590:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changed(label) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(value) ? 32 : 16;
        }
        if ((i & 4) != 0) {
            $dirty |= 384;
        } else if (($changed & 384) == 0) {
            $dirty |= $composer2.changed(isBold) ? 256 : 128;
        }
        if ((i & 8) != 0) {
            $dirty |= 3072;
        } else if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(color) ? 2048 : 1024;
        }
        if ((i & 16) != 0) {
            $dirty |= 24576;
        } else if (($changed & 24576) == 0) {
            $dirty |= $composer2.changed(fontSize) ? 16384 : 8192;
        }
        if (!$composer2.shouldExecute(($dirty & 9363) != 9362, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if ((i & 4) != 0) {
                isBold = false;
            }
            if ((i & 8) != 0) {
                color = Color.Companion.getUnspecified-0d7_KjU();
            }
            if ((i & 16) != 0) {
                fontSize = TextUnitKt.getSp(12);
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1071795232, $dirty, -1, "com.example.sasloopmanager.ReceiptRow (BillingScreen.kt:1449)");
            }
            long textPrimary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurface-0d7_KjU();
            long textSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            if (Color.equals-impl0(color, Color.Companion.getUnspecified-0d7_KjU())) {
                j = isBold ? textPrimary : textSecondary;
            } else {
                j = color;
            }
            long displayColor = j;
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i2 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor);
            } else {
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i3 = 14 & (i2 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i4 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -1745756439, "C1461@73075L214,1467@73298L183:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(label, (Modifier) null, isBold ? textPrimary : textSecondary, (TextAutoSize) null, fontSize, (FontStyle) null, isBold ? FontWeight.Companion.getBold() : FontWeight.Companion.getNormal(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, (14 & $dirty) | (57344 & $dirty), 0, 262058);
            TextKt.Text-Nvy7gAk(value, (Modifier) null, displayColor, (TextAutoSize) null, fontSize, (FontStyle) null, isBold ? FontWeight.Companion.getBlack() : FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, (14 & ($dirty >> 3)) | (57344 & $dirty), 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            boolean z = isBold;
            long j2 = color;
            long j3 = fontSize;
            endRestartGroup.updateScope((v7, v8) -> {
                return ReceiptRow_6jM_SoI$lambda$1(r1, r2, r3, r4, r5, r6, r7, v7, v8);
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final void ItemCustomizationDialog(MenuItem item, List<OptionGroup> list, Function0<Unit> function0, Function2<? super List<SelectedModifier>, ? super String, Unit> function2, String currency, Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        Object obj3;
        Composer $composer2 = $composer.startRestartGroup(-1745650077);
        ComposerKt.sourceInformation($composer2, "C(ItemCustomizationDialog)N(item,optionGroups,onDismiss,onAdd,currency)1484@73731L58,1485@73813L31,1486@73876L7,1488@73912L98,1492@74053L9065,1492@74016L9102:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= ($changed & 8) == 0 ? $composer2.changed(item) : $composer2.changedInstance(item) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changedInstance(list) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changedInstance(function2) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changed(currency) ? 16384 : 8192;
        }
        if (!$composer2.shouldExecute(($dirty & 9363) != 9362, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1745650077, $dirty, -1, "com.example.sasloopmanager.ItemCustomizationDialog (BillingScreen.kt:1483)");
            }
            ComposerKt.sourceInformationMarkerStart($composer2, 1762495837, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer2.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                Object mutableStateOf$default = SnapshotStateKt.mutableStateOf$default(CollectionsKt.emptyList(), (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer2.updateRememberedValue(mutableStateOf$default);
                obj = mutableStateOf$default;
            } else {
                obj = rememberedValue;
            }
            MutableState selectedModifiers$delegate = (MutableState) obj;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerStart($composer2, 1762498434, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer2.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                Object mutableStateOf$default2 = SnapshotStateKt.mutableStateOf$default("", (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer2.updateRememberedValue(mutableStateOf$default2);
                obj2 = mutableStateOf$default2;
            } else {
                obj2 = rememberedValue2;
            }
            MutableState kitchenNote$delegate = (MutableState) obj2;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            CompositionLocal localContext = AndroidCompositionLocals_androidKt.getLocalContext();
            ComposerKt.sourceInformationMarkerStart($composer2, 2023513938, "CC(<get-current>):CompositionLocal.kt#9igjgp");
            Object consume = $composer2.consume(localContext);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Context context = (Context) consume;
            int id = item.getId();
            ComposerKt.sourceInformationMarkerStart($composer2, 1762501669, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer2.changed(id) | $composer2.changed(list);
            Object rememberedValue3 = $composer2.rememberedValue();
            if (changed || rememberedValue3 == Composer.Companion.getEmpty()) {
                Collection arrayList = new ArrayList();
                for (Object obj4 : list) {
                    Integer itemId = ((OptionGroup) obj4).getItemId();
                    if (itemId != null && itemId.intValue() == item.getId()) {
                        arrayList.add(obj4);
                    }
                }
                Object obj5 = (List) arrayList;
                $composer2.updateRememberedValue(obj5);
                obj3 = obj5;
            } else {
                obj3 = rememberedValue3;
            }
            List itemOptionGroups = (List) obj3;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            AndroidDialog_androidKt.Dialog(function0, (DialogProperties) null, ComposableLambdaKt.rememberComposableLambda(-1259160916, true, (v8, v9) -> {
                return ItemCustomizationDialog$lambda$7(r4, r5, r6, r7, r8, r9, r10, r11, v8, v9);
            }, $composer2, 54), $composer2, 384 | (14 & ($dirty >> 6)), 2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v6, v7) -> {
                return ItemCustomizationDialog$lambda$8(r1, r2, r3, r4, r5, r6, v6, v7);
            });
        }
    }

    private static final List<SelectedModifier> ItemCustomizationDialog$lambda$1(MutableState<List<SelectedModifier>> mutableState) {
        return (List) ((State) mutableState).getValue();
    }

    private static final String ItemCustomizationDialog$lambda$4(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit ItemCustomizationDialog$lambda$7(List $itemOptionGroups, Context $context, Function2 $onAdd, Function0 $onDismiss, MenuItem $item, MutableState $selectedModifiers$delegate, String $currency, MutableState $kitchenNote$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1498@74247L37,1500@74352L8760,1493@74063L9049:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1259160916, $changed, -1, "com.example.sasloopmanager.ItemCustomizationDialog.<anonymous> (BillingScreen.kt:1493)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(24)), CardDefaults.INSTANCE.cardColors-ro_MJ88(ColorKt.getCardDark(), 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), ColorKt.getCardBorderDark()), ComposableLambdaKt.rememberComposableLambda(613130362, true, (v8, v9, v10) -> {
                return ItemCustomizationDialog$lambda$7$0(r7, r8, r9, r10, r11, r12, r13, r14, v8, v9, v10);
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit ItemCustomizationDialog$lambda$7$0(List $itemOptionGroups, Context $context, Function2 $onAdd, Function0 $onDismiss, MenuItem $item, MutableState $selectedModifiers$delegate, String $currency, MutableState $kitchenNote$delegate, ColumnScope $this$Card, Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        boolean z;
        Object obj3;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C1501@74366L8736:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(613130362, $changed, -1, "com.example.sasloopmanager.ItemCustomizationDialog.<anonymous>.<anonymous> (BillingScreen.kt:1501)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(20));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (6 >> 3)) | (112 & (6 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (6 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            int i3 = 6 | (112 & (6 >> 6));
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, 478686939, "C1507@74540L1009,1531@75567L41,1537@75807L21,1534@75669L6209,1638@81896L41,1641@81993L565,1653@82729L39,1640@81955L1133:BillingScreen.kt#7ez3px");
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor2);
            } else {
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i6 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 675233554, "C1512@74778L577,1526@75376L155:BillingScreen.kt#7ez3px");
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier2 = Modifier.Companion;
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = 6 | (896 & ((112 & (0 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor3);
            } else {
                $composer.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer);
            Updater.set-impl(composer3, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = 14 & (i7 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            int i9 = 6 | (112 & (0 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1911269647, "C1513@74811L249,1519@75085L248:BillingScreen.kt#7ez3px");
            String upperCase = $item.getDisplayName().toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
            TextKt.Text-Nvy7gAk(upperCase, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(18), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            TextKt.Text-Nvy7gAk("Customize your selection", (Modifier) null, ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            IconButtonKt.IconButton($onDismiss, (Modifier) null, false, (IconButtonColors) null, (MutableInteractionSource) null, (Shape) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$596709634$app(), $composer, 1572864, 62);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16)), $composer, 6);
            Modifier verticalScroll$default = ScrollKt.verticalScroll$default(columnScope.weight(Modifier.Companion, 1.0f, false), ScrollKt.rememberScrollState(0, $composer, 0, 1), false, (FlingBehavior) null, false, 14, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy3 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, verticalScroll$default);
            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
            int i10 = 6 | (896 & ((112 & (0 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor4);
            } else {
                $composer.useNode();
            }
            Composer composer4 = Updater.constructor-impl($composer);
            Updater.set-impl(composer4, columnMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
            int i11 = 14 & (i10 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope3 = ColumnScopeInstance.INSTANCE;
            int i12 = 6 | (112 & (0 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 40720591, "C1610@80523L287,1624@81268L408,1619@80935L20,1617@80831L1029:BillingScreen.kt#7ez3px");
            $composer.startReplaceGroup(694049396);
            ComposerKt.sourceInformation($composer, "*1540@75927L374,1607@80438L41");
            Iterator it = $itemOptionGroups.iterator();
            while (it.hasNext()) {
                OptionGroup optionGroup = (OptionGroup) it.next();
                String upperCase2 = optionGroup.getName().toUpperCase(Locale.ROOT);
                Intrinsics.checkNotNullExpressionValue(upperCase2, "toUpperCase(...)");
                TextKt.Text-Nvy7gAk(upperCase2 + " (Min: " + optionGroup.getMinSelectable() + ", Max: " + optionGroup.getMaxSelectable() + ")", PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(8), 1, (Object) null), ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597488, 0, 262056);
                List options = optionGroup.getOptions();
                if (options == null) {
                    options = CollectionsKt.emptyList();
                }
                $composer.startReplaceGroup(694065521);
                ComposerKt.sourceInformation($composer, "*1550@76462L3925");
                for (List<OptionItem> list : CollectionsKt.chunked(options, 2)) {
                    Modifier modifier3 = PaddingKt.padding-VpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(4), 1, (Object) null);
                    Arrangement.Horizontal horizontal = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                    ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                    MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(horizontal, Alignment.Companion.getTop(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
                    ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                    CompositionLocalMap currentCompositionLocalMap5 = $composer.getCurrentCompositionLocalMap();
                    Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer, modifier3);
                    Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                    int i13 = 6 | (896 & ((112 & (54 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer.startReusableNode();
                    if ($composer.getInserting()) {
                        $composer.createNode(constructor5);
                    } else {
                        $composer.useNode();
                    }
                    Composer composer5 = Updater.constructor-impl($composer);
                    Updater.set-impl(composer5, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                    int i14 = 14 & (i13 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                    int i15 = 6 | (112 & (54 >> 6));
                    RowScope rowScope2 = RowScopeInstance.INSTANCE;
                    ComposerKt.sourceInformationMarkerStart($composer, 588478303, "C:BillingScreen.kt#7ez3px");
                    $composer.startReplaceGroup(1127362001);
                    ComposerKt.sourceInformation($composer, "*1568@77653L1396,1558@76958L3197");
                    for (OptionItem optionItem : list) {
                        Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
                        if (!(ItemCustomizationDialog$lambda$1 instanceof Collection) || !((Collection) ItemCustomizationDialog$lambda$1).isEmpty()) {
                            Iterator it2 = ItemCustomizationDialog$lambda$1.iterator();
                            while (true) {
                                if (!it2.hasNext()) {
                                    z = false;
                                    break;
                                }
                                SelectedModifier selectedModifier = (SelectedModifier) it2.next();
                                if (Intrinsics.areEqual(selectedModifier.getName(), optionItem.getName()) && selectedModifier.getGroupId() == optionGroup.getId()) {
                                    z = true;
                                    break;
                                }
                            }
                        } else {
                            z = false;
                        }
                        boolean z2 = z;
                        double price = optionItem.getPrice();
                        Modifier modifier4 = BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU$default(ClipKt.clip(RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12))), z2 ? ColorKt.getSaSGreen() : ColorKt.getInputDark(), (Shape) null, 2, (Object) null), Dp.constructor-impl(1), z2 ? ColorKt.getSaSGreen() : ColorKt.getCardBorderDark(), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12)));
                        boolean z3 = false;
                        String str = null;
                        Role role = null;
                        MutableInteractionSource mutableInteractionSource = null;
                        ComposerKt.sourceInformationMarkerStart($composer, -48361699, "CC(remember):BillingScreen.kt#9igjgp");
                        boolean changedInstance = $composer.changedInstance(optionGroup) | $composer.changed(optionItem) | $composer.changed(price) | $composer.changedInstance($context);
                        Object rememberedValue = $composer.rememberedValue();
                        if (changedInstance || rememberedValue == Composer.Companion.getEmpty()) {
                            Object obj4 = () -> {
                                return ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0(r0, r1, r2, r3, r4);
                            };
                            modifier4 = modifier4;
                            z3 = false;
                            str = null;
                            role = null;
                            mutableInteractionSource = null;
                            $composer.updateRememberedValue(obj4);
                            obj3 = obj4;
                        } else {
                            obj3 = rememberedValue;
                        }
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        Modifier modifier5 = PaddingKt.padding-3ABfNKs(ClickableKt.clickable-oSLSa3U$default(modifier4, z3, str, role, mutableInteractionSource, (Function0) obj3, 15, (Object) null), Dp.constructor-impl(12));
                        ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                        MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(Alignment.Companion.getTopStart(), false);
                        ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                        CompositionLocalMap currentCompositionLocalMap6 = $composer.getCurrentCompositionLocalMap();
                        Modifier materializeModifier6 = ComposedModifierKt.materializeModifier($composer, modifier5);
                        Function0 constructor6 = ComposeUiNode.Companion.getConstructor();
                        int i16 = 6 | (896 & ((112 & (0 << 3)) << 6));
                        ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer.startReusableNode();
                        if ($composer.getInserting()) {
                            $composer.createNode(constructor6);
                        } else {
                            $composer.useNode();
                        }
                        Composer composer6 = Updater.constructor-impl($composer);
                        Updater.set-impl(composer6, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                        Updater.set-impl(composer6, currentCompositionLocalMap6, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                        Updater.init-impl(composer6, Integer.valueOf(hashCode6), ComposeUiNode.Companion.getSetCompositeKeyHash());
                        Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                        Updater.set-impl(composer6, materializeModifier6, ComposeUiNode.Companion.getSetModifier());
                        int i17 = 14 & (i16 >> 6);
                        ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                        BoxScope boxScope = BoxScopeInstance.INSTANCE;
                        int i18 = 6 | (112 & (0 >> 6));
                        ComposerKt.sourceInformationMarkerStart($composer, -1981898143, "C1586@79190L927:BillingScreen.kt#7ez3px");
                        ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                        Modifier modifier6 = Modifier.Companion;
                        MeasurePolicy columnMeasurePolicy4 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
                        ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode7 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                        CompositionLocalMap currentCompositionLocalMap7 = $composer.getCurrentCompositionLocalMap();
                        Modifier materializeModifier7 = ComposedModifierKt.materializeModifier($composer, modifier6);
                        Function0 constructor7 = ComposeUiNode.Companion.getConstructor();
                        int i19 = 6 | (896 & ((112 & (0 << 3)) << 6));
                        ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer.startReusableNode();
                        if ($composer.getInserting()) {
                            $composer.createNode(constructor7);
                        } else {
                            $composer.useNode();
                        }
                        Composer composer7 = Updater.constructor-impl($composer);
                        Updater.set-impl(composer7, columnMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
                        Updater.set-impl(composer7, currentCompositionLocalMap7, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                        Updater.init-impl(composer7, Integer.valueOf(hashCode7), ComposeUiNode.Companion.getSetCompositeKeyHash());
                        Updater.reconcile-impl(composer7, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                        Updater.set-impl(composer7, materializeModifier7, ComposeUiNode.Companion.getSetModifier());
                        int i20 = 14 & (i19 >> 6);
                        ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                        ColumnScope columnScope4 = ColumnScopeInstance.INSTANCE;
                        int i21 = 6 | (112 & (0 >> 6));
                        ComposerKt.sourceInformationMarkerStart($composer, -1584015274, "C1587@79243L340,1593@79628L447:BillingScreen.kt#7ez3px");
                        String upperCase3 = optionItem.getName().toUpperCase(Locale.ROOT);
                        Intrinsics.checkNotNullExpressionValue(upperCase3, "toUpperCase(...)");
                        TextKt.Text-Nvy7gAk(upperCase3, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
                        StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                        Locale locale = Locale.US;
                        Object[] objArr = {Double.valueOf(price)};
                        String format = String.format(locale, "%.2f", Arrays.copyOf(objArr, objArr.length));
                        Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                        TextKt.Text-Nvy7gAk("+ " + $currency + " " + format, (Modifier) null, z2 ? Color.copy-wmQWz5c$default(Color.Companion.getWhite-0d7_KjU(), 0.8f, 0.0f, 0.0f, 0.0f, 14, (Object) null) : ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getMedium(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        $composer.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        $composer.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                    }
                    $composer.endReplaceGroup();
                    if (list.size() < 2) {
                        $composer.startReplaceGroup(591880242);
                        ComposerKt.sourceInformation($composer, "1603@80285L38");
                        SpacerKt.Spacer(RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null), $composer, 0);
                        $composer.endReplaceGroup();
                    } else {
                        $composer.startReplaceGroup(591985952);
                        $composer.endReplaceGroup();
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                }
                $composer.endReplaceGroup();
                SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(12)), $composer, 6);
            }
            $composer.endReplaceGroup();
            TextKt.Text-Nvy7gAk("KITCHEN NOTE", PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(8), 1, (Object) null), ColorKt.getTextSecondary(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597494, 0, 262056);
            String ItemCustomizationDialog$lambda$4 = ItemCustomizationDialog$lambda$4($kitchenNote$delegate);
            Modifier modifier7 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(75));
            TextFieldColors textFieldColors = OutlinedTextFieldDefaults.INSTANCE.colors-0hiis_0(Color.Companion.getWhite-0d7_KjU(), Color.Companion.getWhite-0d7_KjU(), 0L, 0L, ColorKt.getInputDark(), ColorKt.getInputDark(), 0L, 0L, 0L, 0L, (TextSelectionColors) null, ColorKt.getSaSGreen(), ColorKt.getCardBorderDark(), 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, $composer, 54, 0, 0, 0, 3072, 2147477452, 4095);
            Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12));
            TextStyle textStyle = new TextStyle(0L, TextUnitKt.getSp(11), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777213, (DefaultConstructorMarker) null);
            String str2 = ItemCustomizationDialog$lambda$4;
            ComposerKt.sourceInformationMarkerStart($composer, 694206338, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj5 = (v1) -> {
                    return ItemCustomizationDialog$lambda$7$0$0$1$1$0(r0, v1);
                };
                str2 = str2;
                $composer.updateRememberedValue(obj5);
                obj = obj5;
            } else {
                obj = rememberedValue2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            OutlinedTextFieldKt.OutlinedTextField(str2, (Function1) obj, modifier7, false, false, textStyle, (Function2) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$308535477$app(), (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, false, (VisualTransformation) null, (KeyboardOptions) null, (KeyboardActions) null, false, 2, 0, (MutableInteractionSource) null, shape, textFieldColors, $composer, 12779952, 100663296, 0, 1834840);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16)), $composer, 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093882009, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance2 = $composer.changedInstance($itemOptionGroups) | $composer.changedInstance($context) | $composer.changed($onAdd);
            Object rememberedValue3 = $composer.rememberedValue();
            if (changedInstance2 || rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj6 = () -> {
                    return ItemCustomizationDialog$lambda$7$0$0$2$0(r0, r1, r2, r3, r4);
                };
                $composer.updateRememberedValue(obj6);
                obj2 = obj6;
            } else {
                obj2 = rememberedValue3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.Button((Function0) obj2, SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(48)), false, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(14)), ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14), (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$1960919636$app(), $composer, 805306416, 484);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0(OptionGroup $og, OptionItem $opt, double $optionPrice, Context $context, MutableState $selectedModifiers$delegate) {
        boolean z;
        Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
        Collection arrayList = new ArrayList();
        for (Object obj : ItemCustomizationDialog$lambda$1) {
            if (((SelectedModifier) obj).getGroupId() == $og.getId()) {
                arrayList.add(obj);
            }
        }
        List sameGroupMods = (List) arrayList;
        Iterable ItemCustomizationDialog$lambda$12 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
        if (!(ItemCustomizationDialog$lambda$12 instanceof Collection) || !((Collection) ItemCustomizationDialog$lambda$12).isEmpty()) {
            Iterator it = ItemCustomizationDialog$lambda$12.iterator();
            while (true) {
                if (it.hasNext()) {
                    SelectedModifier selectedModifier = (SelectedModifier) it.next();
                    if (Intrinsics.areEqual(selectedModifier.getName(), $opt.getName()) && selectedModifier.getGroupId() == $og.getId()) {
                        z = true;
                        break;
                    }
                } else {
                    z = false;
                    break;
                }
            }
        } else {
            z = false;
        }
        boolean exists = z;
        if (!exists) {
            if ($og.getMaxSelectable() != 1) {
                if (sameGroupMods.size() >= $og.getMaxSelectable()) {
                    Toast.makeText($context, "Max " + $og.getMaxSelectable() + " options allowed for " + $og.getName(), 0).show();
                } else {
                    $selectedModifiers$delegate.setValue(CollectionsKt.plus(ItemCustomizationDialog$lambda$1($selectedModifiers$delegate), new SelectedModifier($opt.getName(), $optionPrice, $og.getId())));
                }
            } else {
                Iterable ItemCustomizationDialog$lambda$13 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
                Collection arrayList2 = new ArrayList();
                for (Object obj2 : ItemCustomizationDialog$lambda$13) {
                    if (!(((SelectedModifier) obj2).getGroupId() == $og.getId())) {
                        arrayList2.add(obj2);
                    }
                }
                $selectedModifiers$delegate.setValue(CollectionsKt.plus((List) arrayList2, new SelectedModifier($opt.getName(), $optionPrice, $og.getId())));
            }
        } else {
            Iterable ItemCustomizationDialog$lambda$14 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList3 = new ArrayList();
            for (Object obj3 : ItemCustomizationDialog$lambda$14) {
                SelectedModifier selectedModifier2 = (SelectedModifier) obj3;
                if (!(Intrinsics.areEqual(selectedModifier2.getName(), $opt.getName()) && selectedModifier2.getGroupId() == $og.getId())) {
                    arrayList3.add(obj3);
                }
            }
            $selectedModifiers$delegate.setValue((List) arrayList3);
        }
        return Unit.INSTANCE;
    }

    private static final Unit ItemCustomizationDialog$lambda$7$0$0$1$1$0(MutableState $kitchenNote$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $kitchenNote$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit ItemCustomizationDialog$lambda$7$0$0$2$0(List $itemOptionGroups, Context $context, Function2 $onAdd, MutableState $selectedModifiers$delegate, MutableState $kitchenNote$delegate) {
        Iterator it = $itemOptionGroups.iterator();
        while (it.hasNext()) {
            OptionGroup og = (OptionGroup) it.next();
            Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList = new ArrayList();
            for (Object obj : ItemCustomizationDialog$lambda$1) {
                if (((SelectedModifier) obj).getGroupId() == og.getId()) {
                    arrayList.add(obj);
                }
            }
            List sameGroupMods = (List) arrayList;
            if (sameGroupMods.size() < og.getMinSelectable()) {
                Toast.makeText($context, "Please select at least " + og.getMinSelectable() + " option(s) for " + og.getName(), 1).show();
                return Unit.INSTANCE;
            }
        }
        $onAdd.invoke(ItemCustomizationDialog$lambda$1($selectedModifiers$delegate), ItemCustomizationDialog$lambda$4($kitchenNote$delegate));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Triple<String, String, String> parsePhoneNumber(String fullPhone) {
        String cleanPhone = StringsKt.trim(fullPhone).toString();
        List<CountryCodeItem> sortedCodes = CollectionsKt.sortedWith(countryCodes, new BillingScreenKt$parsePhoneNumber$.inlined.sortedByDescending.1());
        for (CountryCodeItem country : sortedCodes) {
            if (StringsKt.startsWith$default(cleanPhone, country.getDialCode(), false, 2, (Object) null)) {
                String code = country.getCode();
                String flag = country.getFlag();
                String substring = cleanPhone.substring(country.getDialCode().length());
                Intrinsics.checkNotNullExpressionValue(substring, "substring(...)");
                return new Triple<>(code, flag, substring);
            }
            String dialCodeNoPlus = StringsKt.removePrefix(country.getDialCode(), "+");
            if (StringsKt.startsWith$default(cleanPhone, dialCodeNoPlus, false, 2, (Object) null)) {
                String code2 = country.getCode();
                String flag2 = country.getFlag();
                String substring2 = cleanPhone.substring(dialCodeNoPlus.length());
                Intrinsics.checkNotNullExpressionValue(substring2, "substring(...)");
                return new Triple<>(code2, flag2, substring2);
            }
        }
        return new Triple<>("IN", "����", cleanPhone);
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: CompactTextField-03iij_k, reason: not valid java name */
    private static final void m2CompactTextField03iij_k(String value, Function1<? super String, Unit> function1, String placeholder, Modifier modifier, KeyboardOptions keyboardOptions, boolean singleLine, long fontSize, CornerBasedShape shape, Composer $composer, int $changed, int i) {
        Composer $composer2 = $composer.startRestartGroup(-2121916777);
        ComposerKt.sourceInformation($composer2, "C(CompactTextField)N(value,onValueChange,placeholder,modifier,keyboardOptions,singleLine,fontSize:c#ui.unit.TextUnit,shape)1728@85961L11,1729@86024L11,1730@86087L11,1731@86153L11,1745@86693L609,1733@86178L1130:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changed(value) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changedInstance(function1) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changed(placeholder) ? 256 : 128;
        }
        if ((i & 8) != 0) {
            $dirty |= 3072;
        } else if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(modifier) ? 2048 : 1024;
        }
        if ((i & 16) != 0) {
            $dirty |= 24576;
        } else if (($changed & 24576) == 0) {
            $dirty |= $composer2.changed(keyboardOptions) ? 16384 : 8192;
        }
        if ((i & 32) != 0) {
            $dirty |= 196608;
        } else if (($changed & 196608) == 0) {
            $dirty |= $composer2.changed(singleLine) ? 131072 : 65536;
        }
        if ((i & 64) != 0) {
            $dirty |= 1572864;
        } else if (($changed & 1572864) == 0) {
            $dirty |= $composer2.changed(fontSize) ? 1048576 : 524288;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= ((i & 128) == 0 && $composer2.changed(shape)) ? 8388608 : 4194304;
        }
        if (!$composer2.shouldExecute(($dirty & 4793491) != 4793490, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            $composer2.startDefaults();
            if (($changed & 1) == 0 || $composer2.getDefaultsInvalid()) {
                if ((i & 8) != 0) {
                    modifier = (Modifier) Modifier.Companion;
                }
                if ((i & 16) != 0) {
                    keyboardOptions = KeyboardOptions.Companion.getDefault();
                }
                if ((i & 32) != 0) {
                    singleLine = true;
                }
                if ((i & 64) != 0) {
                    fontSize = TextUnitKt.getSp(11);
                }
                if ((i & 128) != 0) {
                    shape = (CornerBasedShape) RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(18));
                    $dirty &= -29360129;
                }
            } else {
                $composer2.skipToGroupEnd();
                if ((i & 128) != 0) {
                    $dirty &= -29360129;
                }
            }
            $composer2.endDefaults();
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2121916777, $dirty, -1, "com.example.sasloopmanager.CompactTextField (BillingScreen.kt:1727)");
            }
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnBackground-0d7_KjU();
            long TextSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurfaceVariant-0d7_KjU();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            long j = fontSize;
            BasicTextFieldKt.BasicTextField(value, function1, PaddingKt.padding-VpY3zN4$default(BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU(SizeKt.height-3ABfNKs(modifier, Dp.constructor-impl(40)), InputDark, (Shape) shape), Dp.constructor-impl(1), CardBorderDark, (Shape) shape), Dp.constructor-impl(12), 0.0f, 2, (Object) null), false, false, new TextStyle(TextPrimary, fontSize, FontWeight.Companion.getMedium(), (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777208, (DefaultConstructorMarker) null), keyboardOptions, (KeyboardActions) null, singleLine, 0, 0, (VisualTransformation) null, (Function1) null, (MutableInteractionSource) null, new SolidColor(ColorKt.getSaSGreen(), (DefaultConstructorMarker) null), ComposableLambdaKt.rememberComposableLambda(-1064281324, true, (v4, v5, v6) -> {
                return CompactTextField_03iij_k$lambda$0(r17, r18, r19, r20, v4, v5, v6);
            }, $composer2, 54), $composer2, (14 & $dirty) | (112 & $dirty) | (3670016 & ($dirty << 6)) | (234881024 & ($dirty << 9)), 196608, 16024);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            Modifier modifier2 = modifier;
            KeyboardOptions keyboardOptions2 = keyboardOptions;
            boolean z = singleLine;
            long j2 = fontSize;
            CornerBasedShape cornerBasedShape = shape;
            endRestartGroup.updateScope((v10, v11) -> {
                return CompactTextField_03iij_k$lambda$1(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, v10, v11);
            });
        }
    }

    @Composable
    @ComposableInferredTarget(scheme = "[androidx.compose.ui.UiComposable[androidx.compose.ui.UiComposable]]")
    private static final Unit CompactTextField_03iij_k$lambda$0(String $value, String $placeholder, long $TextSecondary, long $fontSize, Function2 innerTextField, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(innerTextField, "innerTextField");
        ComposerKt.sourceInformation($composer, "CN(innerTextField)1746@86725L567:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer.changedInstance(innerTextField) ? 4 : 2;
        }
        if (!$composer.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1064281324, $dirty, -1, "com.example.sasloopmanager.CompactTextField.<anonymous> (BillingScreen.kt:1746)");
            }
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Alignment centerStart = Alignment.Companion.getCenterStart();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(centerStart, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, fillMaxSize$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (54 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -1721972271, "C1760@87262L16:BillingScreen.kt#7ez3px");
            if ($value.length() == 0) {
                $composer.startReplaceGroup(-1721932530);
                ComposerKt.sourceInformation($composer, "1751@86913L314");
                TextKt.Text-Nvy7gAk($placeholder, (Modifier) null, $TextSecondary, (TextAutoSize) null, $fontSize, (FontStyle) null, FontWeight.Companion.getMedium(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, TextOverflow.Companion.getEllipsis-gIe3tQ8(), false, 1, 0, (Function1) null, (TextStyle) null, $composer, 1572864, 24960, 241578);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1721612920);
                $composer.endReplaceGroup();
            }
            innerTextField.invoke($composer, Integer.valueOf(14 & $dirty));
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final void ThermalGridRow(String left, String right, Composer $composer, int $changed) {
        Composer $composer2 = $composer.startRestartGroup(592293593);
        ComposerKt.sourceInformation($composer2, "C(ThermalGridRow)N(left,right)1768@87386L290:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changed(left) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(right) ? 32 : 16;
        }
        if (!$composer2.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(592293593, $dirty, -1, "com.example.sasloopmanager.ThermalGridRow (BillingScreen.kt:1767)");
            }
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor);
            } else {
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, 94740612, "C1773@87564L48,1774@87621L49:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(left, (Modifier) null, Color.Companion.getBlack-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 24960 | (14 & $dirty), 0, 262122);
            TextKt.Text-Nvy7gAk(right, (Modifier) null, Color.Companion.getBlack-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 24960 | (14 & ($dirty >> 3)), 0, 262122);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v3, v4) -> {
                return ThermalGridRow$lambda$1(r1, r2, r3, v3, v4);
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    /* renamed from: ThermalReceiptRow-JHQioms, reason: not valid java name */
    private static final void m3ThermalReceiptRowJHQioms(String label, String value, boolean isBold, long fontSize, Composer $composer, int $changed, int i) {
        Composer $composer2 = $composer.startRestartGroup(46195100);
        ComposerKt.sourceInformation($composer2, "C(ThermalReceiptRow)N(label,value,isBold,fontSize:c#ui.unit.TextUnit)1785@87853L744:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changed(label) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(value) ? 32 : 16;
        }
        if ((i & 4) != 0) {
            $dirty |= 384;
        } else if (($changed & 384) == 0) {
            $dirty |= $composer2.changed(isBold) ? 256 : 128;
        }
        if ((i & 8) != 0) {
            $dirty |= 3072;
        } else if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(fontSize) ? 2048 : 1024;
        }
        if (!$composer2.shouldExecute(($dirty & 1171) != 1170, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if ((i & 4) != 0) {
                isBold = false;
            }
            if ((i & 8) != 0) {
                fontSize = TextUnitKt.getSp(9);
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(46195100, $dirty, -1, "com.example.sasloopmanager.ThermalReceiptRow (BillingScreen.kt:1784)");
            }
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i2 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor);
            } else {
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i3 = 14 & (i2 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i4 = 6 | (112 & (438 >> 6));
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, 577695707, "C1790@88031L38,1791@88078L236,1798@88323L268:BillingScreen.kt#7ez3px");
            SpacerKt.Spacer(RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null), $composer2, 0);
            TextKt.Text-Nvy7gAk(label, PaddingKt.padding-qDBjuR0$default(Modifier.Companion, 0.0f, 0.0f, Dp.constructor-impl(8), 0.0f, 11, (Object) null), Color.Companion.getBlack-0d7_KjU(), (TextAutoSize) null, fontSize, (FontStyle) null, isBold ? FontWeight.Companion.getBold() : FontWeight.Companion.getNormal(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 432 | (14 & $dirty) | (57344 & ($dirty << 3)), 0, 262056);
            TextKt.Text-Nvy7gAk(value, SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(80)), Color.Companion.getBlack-0d7_KjU(), (TextAutoSize) null, fontSize, (FontStyle) null, isBold ? FontWeight.Companion.getBold() : FontWeight.Companion.getNormal(), (FontFamily) null, 0L, (TextDecoration) null, TextAlign.box-impl(TextAlign.Companion.getEnd-e0LSkKk()), 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 432 | (14 & ($dirty >> 3)) | (57344 & ($dirty << 3)), 0, 261032);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            boolean z = isBold;
            long j = fontSize;
            endRestartGroup.updateScope((v6, v7) -> {
                return ThermalReceiptRow_JHQioms$lambda$1(r1, r2, r3, r4, r5, r6, v6, v7);
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void OldKotDialog(@NotNull Function0<Unit> function0, @NotNull Map<MenuItem, Integer> map, @NotNull BillingViewModel billingViewModel, @NotNull PosSettings posSettings, @NotNull Context context, @Nullable Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        Object obj3;
        Object obj4;
        Intrinsics.checkNotNullParameter(function0, "onDismissRequest");
        Intrinsics.checkNotNullParameter(map, "oldKotItems");
        Intrinsics.checkNotNullParameter(billingViewModel, "billingViewModel");
        Intrinsics.checkNotNullParameter(posSettings, "posSettings");
        Intrinsics.checkNotNullParameter(context, "context");
        Composer $composer2 = $composer.startRestartGroup(1142895150);
        ComposerKt.sourceInformation($composer2, "C(OldKotDialog)N(onDismissRequest,oldKotItems,billingViewModel,posSettings,context)1824@89121L46,1825@89196L45,1826@89269L34,1829@89388L136,1834@89526L13090,1829@89362L13254:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changedInstance(map) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= ($changed & 512) == 0 ? $composer2.changed(billingViewModel) : $composer2.changedInstance(billingViewModel) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= ($changed & 4096) == 0 ? $composer2.changed(posSettings) : $composer2.changedInstance(posSettings) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changedInstance(context) ? 16384 : 8192;
        }
        if ($composer2.shouldExecute(($dirty & 9363) != 9362, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1142895150, $dirty, -1, "com.example.sasloopmanager.OldKotDialog (BillingScreen.kt:1816)");
            }
            long dkBg = androidx.compose.ui.graphics.ColorKt.Color(4279046423L);
            long dkHeader = androidx.compose.ui.graphics.ColorKt.Color(4279638818L);
            long dkInput = androidx.compose.ui.graphics.ColorKt.Color(4280362541L);
            long dkBorder = androidx.compose.ui.graphics.ColorKt.Color(4281349693L);
            long dkTextPrimary = androidx.compose.ui.graphics.ColorKt.Color(4291416537L);
            long dkTextSecondary = androidx.compose.ui.graphics.ColorKt.Color(4287337630L);
            ComposerKt.sourceInformationMarkerStart($composer2, -1189372324, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer2.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                Object mutableStateMapOf = SnapshotStateKt.mutableStateMapOf();
                $composer2.updateRememberedValue(mutableStateMapOf);
                obj = mutableStateMapOf;
            } else {
                obj = rememberedValue;
            }
            SnapshotStateMap selectedOldKotItems = (SnapshotStateMap) obj;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerStart($composer2, -1189369925, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer2.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                Object mutableStateMapOf2 = SnapshotStateKt.mutableStateMapOf();
                $composer2.updateRememberedValue(mutableStateMapOf2);
                obj2 = mutableStateMapOf2;
            } else {
                obj2 = rememberedValue2;
            }
            SnapshotStateMap oldKotItemReasons = (SnapshotStateMap) obj2;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerStart($composer2, -1189367600, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue3 = $composer2.rememberedValue();
            if (rememberedValue3 == Composer.Companion.getEmpty()) {
                Object mutableStateOf$default = SnapshotStateKt.mutableStateOf$default(false, (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer2.updateRememberedValue(mutableStateOf$default);
                obj3 = mutableStateOf$default;
            } else {
                obj3 = rememberedValue3;
            }
            MutableState selectAllOldKot$delegate = (MutableState) obj3;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            List oldKotEntries = CollectionsKt.toList(map.entrySet());
            ComposerKt.sourceInformationMarkerStart($composer2, -1189363690, "CC(remember):BillingScreen.kt#9igjgp");
            boolean z = ($dirty & 14) == 4;
            Object rememberedValue4 = $composer2.rememberedValue();
            if (z || rememberedValue4 == Composer.Companion.getEmpty()) {
                Object obj5 = () -> {
                    return OldKotDialog$lambda$5$0(r0, r1, r2, r3);
                };
                $composer2.updateRememberedValue(obj5);
                obj4 = obj5;
            } else {
                obj4 = rememberedValue4;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            AndroidDialog_androidKt.Dialog((Function0) obj4, (DialogProperties) null, ComposableLambdaKt.rememberComposableLambda(1435683013, true, (v14, v15) -> {
                return OldKotDialog$lambda$6(r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, v14, v15);
            }, $composer2, 54), $composer2, 384, 2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer2.skipToGroupEnd();
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v6, v7) -> {
                return OldKotDialog$lambda$7(r1, r2, r3, r4, r5, r6, v6, v7);
            });
        }
    }

    private static final boolean OldKotDialog$lambda$3(MutableState<Boolean> mutableState) {
        return ((Boolean) ((State) mutableState).getValue()).booleanValue();
    }

    private static final void OldKotDialog$lambda$4(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final Unit OldKotDialog$lambda$5$0(Function0 $onDismissRequest, SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $selectAllOldKot$delegate) {
        $onDismissRequest.invoke();
        $selectedOldKotItems.clear();
        $oldKotItemReasons.clear();
        OldKotDialog$lambda$4($selectAllOldKot$delegate, false);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6(long $dkBg, long $dkBorder, long $dkHeader, List $oldKotEntries, BillingViewModel $billingViewModel, PosSettings $posSettings, long $dkTextPrimary, Function0 $onDismissRequest, SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $selectAllOldKot$delegate, long $dkTextSecondary, long $dkInput, Context $context, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1837@89623L33,1842@89814L12796,1835@89536L13074:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1435683013, $changed, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous> (BillingScreen.kt:1835)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(8)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($dkBg, 0L, 0L, 0L, $composer, 6 | (CardDefaults.$stable << 12), 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $dkBorder), ComposableLambdaKt.rememberComposableLambda(-1551961801, true, (v14, v15, v16) -> {
                return OldKotDialog$lambda$6$0(r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, v14, v15, v16);
            }, $composer, 54), $composer, 221190, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6$0(long $dkHeader, long $dkBg, long $dkBorder, List $oldKotEntries, BillingViewModel $billingViewModel, PosSettings $posSettings, long $dkTextPrimary, Function0 $onDismissRequest, SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $selectAllOldKot$delegate, long $dkTextSecondary, long $dkInput, Context $context, ColumnScope $this$Card, Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        Object obj3;
        Object obj4;
        Object obj5;
        Object obj6;
        Object obj7;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C1843@89828L12772:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1551961801, $changed, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous> (BillingScreen.kt:1843)");
            }
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (0 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (0 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 2115223641, "C1844@89853L1145,1869@91016L1420,1896@92454L35,1898@92507L884,1908@93409L35,1977@99417L3169:BillingScreen.kt#7ez3px");
            Modifier modifier2 = PaddingKt.padding-VpY3zN4(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), $dkHeader, (Shape) null, 2, (Object) null), Dp.constructor-impl(16), Dp.constructor-impl(12));
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor2);
            } else {
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope = RowScopeInstance.INSTANCE;
            int i6 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1705562759, "C1852@90233L86,1856@90524L236,1862@90783L197,1853@90340L640:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("Old KOT", (Modifier) null, $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
            Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(6));
            long j = Color.Companion.getTransparent-0d7_KjU();
            Modifier modifier3 = SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(28));
            boolean z = false;
            String str = null;
            Role role = null;
            MutableInteractionSource mutableInteractionSource = null;
            ComposerKt.sourceInformationMarkerStart($composer, -1468993699, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($onDismissRequest);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj8 = () -> {
                    return OldKotDialog$lambda$6$0$0$0$0$0(r0, r1, r2, r3);
                };
                modifier3 = modifier3;
                z = false;
                str = null;
                role = null;
                mutableInteractionSource = null;
                $composer.updateRememberedValue(obj8);
                obj = obj8;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            SurfaceKt.Surface-T9BRK9s(ClickableKt.clickable-oSLSa3U$default(modifier3, z, str, role, mutableInteractionSource, (Function0) obj, 15, (Object) null), shape, j, 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(1425931436, true, (v1, v2) -> {
                return OldKotDialog$lambda$6$0$0$0$1(r9, v1, v2);
            }, $composer, 54), $composer, 12583296, 120);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            Modifier modifier4 = PaddingKt.padding-VpY3zN4(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), $dkBg, (Shape) null, 2, (Object) null), Dp.constructor-impl(12), Dp.constructor-impl(8));
            Arrangement.Horizontal end = Arrangement.INSTANCE.getEnd();
            Alignment.Vertical centerVertically2 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(end, centerVertically2, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier4);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor3);
            } else {
                $composer.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer);
            Updater.set-impl(composer3, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = 14 & (i7 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope2 = RowScopeInstance.INSTANCE;
            int i9 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -235975868, "C1876@91438L243,1874@91307L1111:BillingScreen.kt#7ez3px");
            Alignment.Vertical centerVertically3 = Alignment.Companion.getCenterVertically();
            Modifier modifier5 = Modifier.Companion;
            boolean z2 = false;
            String str2 = null;
            Role role2 = null;
            MutableInteractionSource mutableInteractionSource2 = null;
            ComposerKt.sourceInformationMarkerStart($composer, -146156133, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($oldKotEntries);
            Object rememberedValue2 = $composer.rememberedValue();
            if (changedInstance || rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj9 = () -> {
                    return OldKotDialog$lambda$6$0$0$1$0$0(r0, r1, r2);
                };
                modifier5 = modifier5;
                z2 = false;
                str2 = null;
                role2 = null;
                mutableInteractionSource2 = null;
                $composer.updateRememberedValue(obj9);
                obj2 = obj9;
            } else {
                obj2 = rememberedValue2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            Modifier modifier6 = ClickableKt.clickable-oSLSa3U$default(modifier5, z2, str2, role2, mutableInteractionSource2, (Function0) obj2, 15, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy3 = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically3, $composer, (14 & (384 >> 3)) | (112 & (384 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier6);
            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
            int i10 = 6 | (896 & ((112 & (384 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor4);
            } else {
                $composer.useNode();
            }
            Composer composer4 = Updater.constructor-impl($composer);
            Updater.set-impl(composer4, rowMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
            int i11 = 14 & (i10 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope3 = RowScopeInstance.INSTANCE;
            int i12 = 6 | (112 & (384 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -146625795, "C1888@92107L65,1884@91841L210,1882@91730L529,1891@92284L28,1892@92337L59:BillingScreen.kt#7ez3px");
            boolean OldKotDialog$lambda$3 = OldKotDialog$lambda$3($selectAllOldKot$delegate);
            CheckboxColors checkboxColors = CheckboxDefaults.INSTANCE.colors-5tl4gsc(ColorKt.getSaSGreen(), $dkTextSecondary, 0L, 0L, 0L, 0L, $composer, 48 | (CheckboxDefaults.$stable << 18), 60);
            Modifier modifier7 = SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(20));
            boolean z3 = OldKotDialog$lambda$3;
            ComposerKt.sourceInformationMarkerStart($composer, -1667294754, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance2 = $composer.changedInstance($oldKotEntries);
            Object rememberedValue3 = $composer.rememberedValue();
            if (changedInstance2 || rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj10 = (v3) -> {
                    return OldKotDialog$lambda$6$0$0$1$1$0$0(r0, r1, r2, v3);
                };
                z3 = z3;
                $composer.updateRememberedValue(obj10);
                obj3 = obj10;
            } else {
                obj3 = rememberedValue3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            CheckboxKt.Checkbox(z3, (Function1) obj3, modifier7, false, checkboxColors, (MutableInteractionSource) null, $composer, 384, 40);
            SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(4)), $composer, 6);
            TextKt.Text-Nvy7gAk("Select All", (Modifier) null, $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24966, 0, 262122);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            DividerKt.HorizontalDivider-9IZ8Weo((Modifier) null, 0.0f, $dkBorder, $composer, 384, 3);
            Modifier modifier8 = PaddingKt.padding-VpY3zN4(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), $dkHeader, (Shape) null, 2, (Object) null), Dp.constructor-impl(8), Dp.constructor-impl(6));
            Alignment.Vertical centerVertically4 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy4 = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically4, $composer, (14 & (390 >> 3)) | (112 & (390 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap5 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer, modifier8);
            Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
            int i13 = 6 | (896 & ((112 & (390 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor5);
            } else {
                $composer.useNode();
            }
            Composer composer5 = Updater.constructor-impl($composer);
            Updater.set-impl(composer5, rowMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
            int i14 = 14 & (i13 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i15 = 6 | (112 & (390 >> 6));
            RowScope rowScope4 = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, -477687999, "C1902@92740L122,1903@92883L148,1904@93052L148,1905@93221L152:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("Item Name", RowScope.weight$default(rowScope4, Modifier.Companion, 1.0f, false, 2, (Object) null), $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262056);
            TextKt.Text-Nvy7gAk("Qty", SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(70)), $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, TextAlign.box-impl(TextAlign.Companion.getCenter-e0LSkKk()), 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597878, 0, 261032);
            TextKt.Text-Nvy7gAk("Amount", SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(56)), $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, TextAlign.box-impl(TextAlign.Companion.getEnd-e0LSkKk()), 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597878, 0, 261032);
            TextKt.Text-Nvy7gAk("Actions", SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(80)), $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, TextAlign.box-impl(TextAlign.Companion.getCenter-e0LSkKk()), 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597878, 0, 261032);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            DividerKt.HorizontalDivider-9IZ8Weo((Modifier) null, 0.0f, $dkBorder, $composer, 384, 3);
            if ($oldKotEntries.isEmpty()) {
                $composer.startReplaceGroup(2118446617);
                ComposerKt.sourceInformation($composer, "1911@93513L244");
                Modifier modifier9 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(100));
                Alignment center = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap6 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier6 = ComposedModifierKt.materializeModifier($composer, modifier9);
                Function0 constructor6 = ComposeUiNode.Companion.getConstructor();
                int i16 = 6 | (896 & ((112 & (54 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor6);
                } else {
                    $composer.useNode();
                }
                Composer composer6 = Updater.constructor-impl($composer);
                Updater.set-impl(composer6, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer6, currentCompositionLocalMap6, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer6, Integer.valueOf(hashCode6), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer6, materializeModifier6, ComposeUiNode.Companion.getSetModifier());
                int i17 = 14 & (i16 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope = BoxScopeInstance.INSTANCE;
                int i18 = 6 | (112 & (54 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer, -1989223347, "C1912@93631L104:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk("No items found in bill.", (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(12), FontStyle.box-impl(FontStyle.Companion.getItalic-_-LCdwA()), (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24966, 0, 262090);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(2118899651);
                ComposerKt.sourceInformation($composer, "1915@93873L5508,1915@93803L5578");
                Modifier modifier10 = SizeKt.heightIn-VpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(280), 1, (Object) null);
                LazyListState lazyListState = null;
                PaddingValues paddingValues = null;
                boolean z4 = false;
                Arrangement.Vertical vertical = null;
                Alignment.Horizontal horizontal = null;
                FlingBehavior flingBehavior = null;
                boolean z5 = false;
                OverscrollEffect overscrollEffect = null;
                ComposerKt.sourceInformationMarkerStart($composer, 1592375089, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance3 = $composer.changedInstance($oldKotEntries) | $composer.changedInstance($billingViewModel) | $composer.changedInstance($posSettings);
                Object rememberedValue4 = $composer.rememberedValue();
                if (changedInstance3 || rememberedValue4 == Composer.Companion.getEmpty()) {
                    Object obj11 = (v11) -> {
                        return OldKotDialog$lambda$6$0$0$4$0(r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, v11);
                    };
                    modifier10 = modifier10;
                    lazyListState = null;
                    paddingValues = null;
                    z4 = false;
                    vertical = null;
                    horizontal = null;
                    flingBehavior = null;
                    z5 = false;
                    overscrollEffect = null;
                    $composer.updateRememberedValue(obj11);
                    obj4 = obj11;
                } else {
                    obj4 = rememberedValue4;
                }
                ComposerKt.sourceInformationMarkerEnd($composer);
                LazyDslKt.LazyColumn(modifier10, lazyListState, paddingValues, z4, vertical, horizontal, flingBehavior, z5, overscrollEffect, (Function1) obj4, $composer, 6, 510);
                $composer.endReplaceGroup();
            }
            Modifier modifier11 = PaddingKt.padding-VpY3zN4(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), $dkHeader, (Shape) null, 2, (Object) null), Dp.constructor-impl(8), Dp.constructor-impl(10));
            Arrangement.Horizontal spaceBetween2 = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically5 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy5 = RowKt.rowMeasurePolicy(spaceBetween2, centerVertically5, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode7 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap7 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier7 = ComposedModifierKt.materializeModifier($composer, modifier11);
            Function0 constructor7 = ComposeUiNode.Companion.getConstructor();
            int i19 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor7);
            } else {
                $composer.useNode();
            }
            Composer composer7 = Updater.constructor-impl($composer);
            Updater.set-impl(composer7, rowMeasurePolicy5, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer7, currentCompositionLocalMap7, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer7, Integer.valueOf(hashCode7), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer7, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer7, materializeModifier7, ComposeUiNode.Companion.getSetModifier());
            int i20 = 14 & (i19 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope5 = RowScopeInstance.INSTANCE;
            int i21 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -719316678, "C1982@99721L2158,2009@102228L39,2003@101942L236,2002@101900L668:BillingScreen.kt#7ez3px");
            Arrangement.Horizontal horizontal2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(4));
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier12 = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy6 = RowKt.rowMeasurePolicy(horizontal2, Alignment.Companion.getTop(), $composer, (14 & (48 >> 3)) | (112 & (48 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode8 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap8 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier8 = ComposedModifierKt.materializeModifier($composer, modifier12);
            Function0 constructor8 = ComposeUiNode.Companion.getConstructor();
            int i22 = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor8);
            } else {
                $composer.useNode();
            }
            Composer composer8 = Updater.constructor-impl($composer);
            Updater.set-impl(composer8, rowMeasurePolicy6, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer8, currentCompositionLocalMap8, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer8, Integer.valueOf(hashCode8), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer8, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer8, materializeModifier8, ComposeUiNode.Companion.getSetModifier());
            int i23 = 14 & (i22 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope6 = RowScopeInstance.INSTANCE;
            int i24 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -629977393, "C1983@99892L511,1987@100405L211,1983@99803L813,1990@100730L914,1998@101646L211,1990@100641L1216:BillingScreen.kt#7ez3px");
            Shape shape2 = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
            Modifier modifier13 = Modifier.Companion;
            boolean z6 = false;
            String str3 = null;
            Role role3 = null;
            MutableInteractionSource mutableInteractionSource3 = null;
            ComposerKt.sourceInformationMarkerStart($composer, -574509875, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance4 = $composer.changedInstance($oldKotEntries) | $composer.changedInstance($context) | $composer.changedInstance($billingViewModel);
            Object rememberedValue5 = $composer.rememberedValue();
            if (changedInstance4 || rememberedValue5 == Composer.Companion.getEmpty()) {
                Object obj12 = () -> {
                    return OldKotDialog$lambda$6$0$0$5$0$0$0(r0, r1, r2, r3, r4);
                };
                modifier13 = modifier13;
                z6 = false;
                str3 = null;
                role3 = null;
                mutableInteractionSource3 = null;
                $composer.updateRememberedValue(obj12);
                obj5 = obj12;
            } else {
                obj5 = rememberedValue5;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            SurfaceKt.Surface-T9BRK9s(ClickableKt.clickable-oSLSa3U$default(modifier13, z6, str3, role3, mutableInteractionSource3, (Function0) obj5, 15, (Object) null), shape2, $dkInput, 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(1274065673, true, (v1, v2) -> {
                return OldKotDialog$lambda$6$0$0$5$0$1(r9, v1, v2);
            }, $composer, 54), $composer, 12583296, 120);
            Shape shape3 = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
            Modifier modifier14 = Modifier.Companion;
            boolean z7 = false;
            String str4 = null;
            Role role4 = null;
            MutableInteractionSource mutableInteractionSource4 = null;
            ComposerKt.sourceInformationMarkerStart($composer, -574482656, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance5 = $composer.changedInstance($context) | $composer.changedInstance($oldKotEntries) | $composer.changedInstance($billingViewModel);
            Object rememberedValue6 = $composer.rememberedValue();
            if (changedInstance5 || rememberedValue6 == Composer.Companion.getEmpty()) {
                Object obj13 = () -> {
                    return OldKotDialog$lambda$6$0$0$5$0$2$0(r0, r1, r2, r3, r4, r5);
                };
                modifier14 = modifier14;
                z7 = false;
                str4 = null;
                role4 = null;
                mutableInteractionSource4 = null;
                $composer.updateRememberedValue(obj13);
                obj6 = obj13;
            } else {
                obj6 = rememberedValue6;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            SurfaceKt.Surface-T9BRK9s(ClickableKt.clickable-oSLSa3U$default(modifier14, z7, str4, role4, mutableInteractionSource4, (Function0) obj6, 15, (Object) null), shape3, $dkInput, 0L, 0.0f, 0.0f, (BorderStroke) null, ComposableLambdaKt.rememberComposableLambda(-1751794944, true, (v1, v2) -> {
                return OldKotDialog$lambda$6$0$0$5$0$3(r9, v1, v2);
            }, $composer, 54), $composer, 12583296, 120);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonColors buttonColors = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14);
            Shape shape4 = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
            PaddingValues paddingValues2 = PaddingKt.PaddingValues-YgX7TsA(Dp.constructor-impl(20), Dp.constructor-impl(6));
            ComposerKt.sourceInformationMarkerStart($composer, 946696022, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed2 = $composer.changed($onDismissRequest);
            Object rememberedValue7 = $composer.rememberedValue();
            if (changed2 || rememberedValue7 == Composer.Companion.getEmpty()) {
                Object obj14 = () -> {
                    return OldKotDialog$lambda$6$0$0$5$1$0(r0, r1, r2, r3);
                };
                $composer.updateRememberedValue(obj14);
                obj7 = obj14;
            } else {
                obj7 = rememberedValue7;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.Button((Function0) obj7, (Modifier) null, false, shape4, buttonColors, (ButtonElevation) null, (BorderStroke) null, paddingValues2, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-1772725126$app(), $composer, 817889280, 358);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$0$0$0(Function0 $onDismissRequest, SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $selectAllOldKot$delegate) {
        $onDismissRequest.invoke();
        $selectedOldKotItems.clear();
        $oldKotItemReasons.clear();
        OldKotDialog$lambda$4($selectAllOldKot$delegate, false);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6$0$0$0$1(long $dkTextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1863@90809L149:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1425931436, $changed, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1863)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -305163671, "C1864@90880L52:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("✕", (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24966, 0, 262122);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$1$0$0(List $oldKotEntries, MutableState $selectAllOldKot$delegate, SnapshotStateMap $selectedOldKotItems) {
        boolean newVal = !OldKotDialog$lambda$3($selectAllOldKot$delegate);
        OldKotDialog$lambda$4($selectAllOldKot$delegate, newVal);
        int i = 0;
        for (Object obj : $oldKotEntries) {
            int i2 = i;
            i++;
            if (i2 < 0) {
                CollectionsKt.throwIndexOverflow();
            }
            ((Map) $selectedOldKotItems).put(Integer.valueOf(i2), Boolean.valueOf(newVal));
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$1$1$0$0(List $oldKotEntries, MutableState $selectAllOldKot$delegate, SnapshotStateMap $selectedOldKotItems, boolean checked) {
        OldKotDialog$lambda$4($selectAllOldKot$delegate, checked);
        int i = 0;
        for (Object obj : $oldKotEntries) {
            int i2 = i;
            i++;
            if (i2 < 0) {
                CollectionsKt.throwIndexOverflow();
            }
            ((Map) $selectedOldKotItems).put(Integer.valueOf(i2), Boolean.valueOf(checked));
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$4$0(List $oldKotEntries, SnapshotStateMap $selectedOldKotItems, long $dkHeader, long $dkBorder, PosSettings $posSettings, long $dkTextPrimary, long $dkTextSecondary, BillingViewModel $billingViewModel, long $dkInput, SnapshotStateMap $oldKotItemReasons, MutableState $selectAllOldKot$delegate, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        LazyListScope.items$default($this$LazyColumn, $oldKotEntries.size(), (Function1) null, (Function1) null, ComposableLambdaKt.composableLambdaInstance(1360815471, true, (v11, v12, v13, v14) -> {
            return OldKotDialog$lambda$6$0$0$4$0$0(r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, v11, v12, v13, v14);
        }), 6, (Object) null);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0(List $oldKotEntries, SnapshotStateMap $selectedOldKotItems, long $dkHeader, long $dkBorder, PosSettings $posSettings, long $dkTextPrimary, long $dkTextSecondary, BillingViewModel $billingViewModel, long $dkInput, SnapshotStateMap $oldKotItemReasons, MutableState $selectAllOldKot$delegate, LazyItemScope $this$items, int idx, Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        Object obj3;
        Object obj4;
        Intrinsics.checkNotNullParameter($this$items, "$this$items");
        ComposerKt.sourceInformation($composer, "CN(idx)1924@94375L4958:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 48) == 0) {
            $dirty |= $composer.changed(idx) ? 32 : 16;
        }
        if ($composer.shouldExecute(($dirty & 145) != 144, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1360815471, $dirty, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1917)");
            }
            Map.Entry entry = (Map.Entry) $oldKotEntries.get(idx);
            MenuItem item = (MenuItem) entry.getKey();
            int qty = ((Number) entry.getValue()).intValue();
            Boolean bool = (Boolean) $selectedOldKotItems.get(Integer.valueOf(idx));
            boolean isSelected = bool != null ? bool.booleanValue() : false;
            double itemAmount = item.getPrice() * qty;
            List selectedModifiers = item.getSelectedModifiers();
            if (selectedModifiers == null) {
                selectedModifiers = CollectionsKt.emptyList();
            }
            double d = 0.0d;
            Iterator it = selectedModifiers.iterator();
            while (it.hasNext()) {
                d += ((SelectedModifier) it.next()).getPrice();
            }
            double modifierTotal = d * qty;
            Modifier modifier = BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), idx % 2 == 0 ? Color.Companion.getTransparent-0d7_KjU() : Color.copy-wmQWz5c$default($dkHeader, 0.5f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (Shape) null, 2, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (0 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (0 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -1343264420, "C1925@94533L4683,1971@99249L54:BillingScreen.kt#7ez3px");
            Modifier modifier2 = PaddingKt.padding-VpY3zN4(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(8), Dp.constructor-impl(6));
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, (14 & (390 >> 3)) | (112 & (390 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (390 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor2);
            } else {
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i6 = 6 | (112 & (390 >> 6));
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, 527954619, "C1926@94703L877,1937@95617L1255,1946@96909L194,1947@97140L2042:BillingScreen.kt#7ez3px");
            Modifier weight$default = RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer, (14 & (0 >> 3)) | (112 & (0 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, weight$default);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = 6 | (896 & ((112 & (0 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor3);
            } else {
                $composer.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer);
            Updater.set-impl(composer3, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = 14 & (i7 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            int i9 = 6 | (112 & (0 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -791793426, "C1927@94784L357:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(item.getPriceLabel() != null ? item.getDisplayName() + " (" + item.getPriceLabel() + ")" : item.getDisplayName(), (Modifier) null, $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getMedium(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, TextOverflow.Companion.getEllipsis-gIe3tQ8(), false, 2, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 24960, 241578);
            List selectedModifiers2 = item.getSelectedModifiers();
            if (selectedModifiers2 == null || selectedModifiers2.isEmpty()) {
                $composer.startReplaceGroup(-791064989);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-791367704);
                ComposerKt.sourceInformation($composer, "*1933@95361L93");
                Iterator it2 = item.getSelectedModifiers().iterator();
                while (it2.hasNext()) {
                    TextKt.Text-Nvy7gAk("+ " + ((SelectedModifier) it2.next()).getName(), (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(9), FontStyle.box-impl(FontStyle.Companion.getItalic-_-LCdwA()), (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24960, 0, 262090);
                }
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            Modifier modifier3 = SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(70));
            Arrangement.Horizontal center = Arrangement.INSTANCE.getCenter();
            Alignment.Vertical centerVertically2 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(center, centerVertically2, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier3);
            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
            int i10 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor4);
            } else {
                $composer.useNode();
            }
            Composer composer4 = Updater.constructor-impl($composer);
            Updater.set-impl(composer4, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
            int i11 = 14 & (i10 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope2 = RowScopeInstance.INSTANCE;
            int i12 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 1674604161, "C1938@95916L74,1938@95992L214,1938@95789L417,1941@96247L147,1942@96562L55,1942@96619L215,1942@96435L399:BillingScreen.kt#7ez3px");
            Shape circleShape = RoundedCornerShapeKt.getCircleShape();
            BorderStroke borderStroke = BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $dkBorder);
            Modifier modifier4 = SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(22));
            boolean z = false;
            String str = null;
            Role role = null;
            MutableInteractionSource mutableInteractionSource = null;
            ComposerKt.sourceInformationMarkerStart($composer, 1162401239, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel) | $composer.changedInstance(item) | $composer.changed(qty);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj5 = () -> {
                    return OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$0$0(r0, r1, r2);
                };
                modifier4 = modifier4;
                z = false;
                str = null;
                role = null;
                mutableInteractionSource = null;
                $composer.updateRememberedValue(obj5);
                obj = obj5;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            SurfaceKt.Surface-T9BRK9s(ClickableKt.clickable-oSLSa3U$default(modifier4, z, str, role, mutableInteractionSource, (Function0) obj, 15, (Object) null), circleShape, $dkInput, 0L, 0.0f, 0.0f, borderStroke, ComposableLambdaKt.rememberComposableLambda(-568451512, true, (v1, v2) -> {
                return OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$1(r9, v1, v2);
            }, $composer, 54), $composer, 14156160, 56);
            TextKt.Text-Nvy7gAk(String.valueOf(qty), SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(22)), $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, TextAlign.box-impl(TextAlign.Companion.getCenter-e0LSkKk()), 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 261032);
            Shape circleShape2 = RoundedCornerShapeKt.getCircleShape();
            BorderStroke borderStroke2 = BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $dkBorder);
            Modifier modifier5 = SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(22));
            boolean z2 = false;
            String str2 = null;
            Role role2 = null;
            MutableInteractionSource mutableInteractionSource2 = null;
            ComposerKt.sourceInformationMarkerStart($composer, 1162421892, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance2 = $composer.changedInstance($billingViewModel) | $composer.changedInstance(item) | $composer.changed(qty);
            Object rememberedValue2 = $composer.rememberedValue();
            if (changedInstance2 || rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj6 = () -> {
                    return OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$2$0(r0, r1, r2);
                };
                modifier5 = modifier5;
                z2 = false;
                str2 = null;
                role2 = null;
                mutableInteractionSource2 = null;
                $composer.updateRememberedValue(obj6);
                obj2 = obj6;
            } else {
                obj2 = rememberedValue2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            SurfaceKt.Surface-T9BRK9s(ClickableKt.clickable-oSLSa3U$default(modifier5, z2, str2, role2, mutableInteractionSource2, (Function0) obj2, 15, (Object) null), circleShape2, $dkInput, 0L, 0.0f, 0.0f, borderStroke2, ComposableLambdaKt.rememberComposableLambda(-429793345, true, (v1, v2) -> {
                return OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$3(r9, v1, v2);
            }, $composer, 54), $composer, 14156160, 56);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            TextKt.Text-Nvy7gAk(formatPrice(itemAmount + modifierTotal, $posSettings), SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(56)), $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getSemiBold(), (FontFamily) null, 0L, (TextDecoration) null, TextAlign.box-impl(TextAlign.Companion.getEnd-e0LSkKk()), 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597872, 0, 261032);
            Modifier modifier6 = SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(80));
            Alignment.Horizontal centerHorizontally = Alignment.Companion.getCenterHorizontally();
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy3 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), centerHorizontally, $composer, (14 & (390 >> 3)) | (112 & (390 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap5 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer, modifier6);
            Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
            int i13 = 6 | (896 & ((112 & (390 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor5);
            } else {
                $composer.useNode();
            }
            Composer composer5 = Updater.constructor-impl($composer);
            Updater.set-impl(composer5, columnMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
            int i14 = 14 & (i13 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope3 = ColumnScopeInstance.INSTANCE;
            int i15 = 6 | (112 & (390 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -192220896, "C1951@97615L65,1950@97413L130,1948@97275L524,1954@97840L29,1957@98068L31,1962@98644L458,1955@97910L1234:BillingScreen.kt#7ez3px");
            CheckboxColors checkboxColors = CheckboxDefaults.INSTANCE.colors-5tl4gsc(ColorKt.getSaSGreen(), $dkTextSecondary, 0L, 0L, 0L, 0L, $composer, 48 | (CheckboxDefaults.$stable << 18), 60);
            Modifier modifier7 = SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18));
            boolean z3 = isSelected;
            ComposerKt.sourceInformationMarkerStart($composer, 1240727992, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance3 = (($dirty & 112) == 32) | $composer.changedInstance($oldKotEntries);
            Object rememberedValue3 = $composer.rememberedValue();
            if (changedInstance3 || rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj7 = (v4) -> {
                    return OldKotDialog$lambda$6$0$0$4$0$0$1$0$2$0$0(r0, r1, r2, r3, v4);
                };
                z3 = z3;
                $composer.updateRememberedValue(obj7);
                obj3 = obj7;
            } else {
                obj3 = rememberedValue3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            CheckboxKt.Checkbox(z3, (Function1) obj3, modifier7, false, checkboxColors, (MutableInteractionSource) null, $composer, 384, 40);
            SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(2)), $composer, 6);
            String str3 = (String) $oldKotItemReasons.get(Integer.valueOf(idx));
            if (str3 == null) {
                str3 = "";
            }
            String str4 = str3;
            TextStyle textStyle = new TextStyle($dkTextPrimary, TextUnitKt.getSp(9), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777212, (DefaultConstructorMarker) null);
            Brush solidColor = new SolidColor(ColorKt.getSaSGreen(), (DefaultConstructorMarker) null);
            Modifier modifier8 = PaddingKt.padding-VpY3zN4(BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU(SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(20)), $dkInput, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(4))), Dp.constructor-impl(1), $dkBorder, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(4))), Dp.constructor-impl(4), Dp.constructor-impl(2));
            String str5 = str4;
            ComposerKt.sourceInformationMarkerStart($composer, 1240748853, "CC(remember):BillingScreen.kt#9igjgp");
            boolean z4 = ($dirty & 112) == 32;
            Object rememberedValue4 = $composer.rememberedValue();
            if (z4 || rememberedValue4 == Composer.Companion.getEmpty()) {
                Object obj8 = (v2) -> {
                    return OldKotDialog$lambda$6$0$0$4$0$0$1$0$2$1$0(r0, r1, v2);
                };
                str5 = str5;
                $composer.updateRememberedValue(obj8);
                obj4 = obj8;
            } else {
                obj4 = rememberedValue4;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            BasicTextFieldKt.BasicTextField(str5, (Function1) obj4, modifier8, false, false, textStyle, (KeyboardOptions) null, (KeyboardActions) null, true, 0, 0, (VisualTransformation) null, (Function1) null, (MutableInteractionSource) null, solidColor, ComposableLambdaKt.rememberComposableLambda(333624115, true, (v3, v4, v5) -> {
                return OldKotDialog$lambda$6$0$0$4$0$0$1$0$2$2(r17, r18, r19, v3, v4, v5);
            }, $composer, 54), $composer, 100859904, 196608, 16088);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            DividerKt.HorizontalDivider-9IZ8Weo((Modifier) null, 0.0f, Color.copy-wmQWz5c$default($dkBorder, 0.5f, 0.0f, 0.0f, 0.0f, 14, (Object) null), $composer, 384, 3);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$0$0(BillingViewModel $billingViewModel, MenuItem $item, int $qty) {
        $billingViewModel.updateOldKotItemQty($item, RangesKt.coerceAtLeast($qty - 1, 1));
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$1(long $dkTextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1939@96038L126:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-568451512, $changed, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1939)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -1733943984, "C1939@96081L81:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("—", (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(9), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$2$0(BillingViewModel $billingViewModel, MenuItem $item, int $qty) {
        $billingViewModel.updateOldKotItemQty($item, $qty + 1);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0$1$0$1$3(long $dkTextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1943@96665L127:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-429793345, $changed, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1943)");
            }
            Alignment center = Alignment.Companion.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -299554024, "C1943@96708L82:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("+", (Modifier) null, $dkTextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0$1$0$2$0$0(SnapshotStateMap $selectedOldKotItems, int $idx, List $oldKotEntries, MutableState $selectAllOldKot$delegate, boolean checked) {
        boolean z;
        ((Map) $selectedOldKotItems).put(Integer.valueOf($idx), Boolean.valueOf(checked));
        Iterable indices = CollectionsKt.getIndices($oldKotEntries);
        if (!(indices instanceof Collection) || !((Collection) indices).isEmpty()) {
            IntIterator it = indices.iterator();
            while (true) {
                if (!it.hasNext()) {
                    z = true;
                    break;
                }
                if (!Intrinsics.areEqual($selectedOldKotItems.get(Integer.valueOf(it.nextInt())), true)) {
                    z = false;
                    break;
                }
            }
        } else {
            z = true;
        }
        OldKotDialog$lambda$4($selectAllOldKot$delegate, z);
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0$1$0$2$1$0(SnapshotStateMap $oldKotItemReasons, int $idx, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        ((Map) $oldKotItemReasons).put(Integer.valueOf($idx), it);
        return Unit.INSTANCE;
    }

    @Composable
    @ComposableInferredTarget(scheme = "[androidx.compose.ui.UiComposable[androidx.compose.ui.UiComposable]]")
    private static final Unit OldKotDialog$lambda$6$0$0$4$0$0$1$0$2$2(SnapshotStateMap $oldKotItemReasons, int $idx, long $dkTextSecondary, Function2 innerTextField, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(innerTextField, "innerTextField");
        ComposerKt.sourceInformation($composer, "CN(innerTextField)1963@98712L344:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer.changedInstance(innerTextField) ? 4 : 2;
        }
        if (!$composer.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(333624115, $dirty, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1963)");
            }
            Alignment centerStart = Alignment.Companion.getCenterStart();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.Companion;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(centerStart, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScope boxScope = BoxScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 292112360, "C1965@98990L16:BillingScreen.kt#7ez3px");
            String str = (String) $oldKotItemReasons.get(Integer.valueOf($idx));
            if (str == null) {
                str = "";
            }
            if (str.length() == 0) {
                $composer.startReplaceGroup(292154426);
                ComposerKt.sourceInformation($composer, "1964@98860L75");
                TextKt.Text-Nvy7gAk("Reason", (Modifier) null, Color.copy-wmQWz5c$default($dkTextSecondary, 0.5f, 0.0f, 0.0f, 0.0f, 14, (Object) null), (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24966, 0, 262122);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(292230345);
                $composer.endReplaceGroup();
            }
            innerTextField.invoke($composer, Integer.valueOf(14 & $dirty));
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$5$0$0$0(List $oldKotEntries, Context $context, BillingViewModel $billingViewModel, SnapshotStateMap $selectedOldKotItems, MutableState $selectAllOldKot$delegate) {
        Collection arrayList = new ArrayList();
        int i = 0;
        for (Object obj : $oldKotEntries) {
            int i2 = i;
            i++;
            if (i2 < 0) {
                CollectionsKt.throwIndexOverflow();
            }
            if (Intrinsics.areEqual($selectedOldKotItems.get(Integer.valueOf(i2)), true)) {
                arrayList.add(obj);
            }
        }
        Iterable iterable = (List) arrayList;
        Collection arrayList2 = new ArrayList(CollectionsKt.collectionSizeOrDefault(iterable, 10));
        Iterator it = iterable.iterator();
        while (it.hasNext()) {
            arrayList2.add((MenuItem) ((Map.Entry) it.next()).getKey());
        }
        Set selected = CollectionsKt.toSet((List) arrayList2);
        if (selected.isEmpty()) {
            Toast.makeText($context, "No items selected!", 0).show();
        } else {
            $billingViewModel.removeOldKotItems(selected);
            $selectedOldKotItems.clear();
            OldKotDialog$lambda$4($selectAllOldKot$delegate, false);
            Toast.makeText($context, "Selected items deleted", 0).show();
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6$0$0$5$0$1(long $dkTextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1988@100435L155:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1274065673, $changed, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1988)");
            }
            TextKt.Text-Nvy7gAk("Delete KOT", PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(10), Dp.constructor-impl(6)), $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597878, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$5$0$2$0(SnapshotStateMap $selectedOldKotItems, Context $context, BillingViewModel $billingViewModel, SnapshotStateMap $oldKotItemReasons, List $oldKotEntries, MutableState $selectAllOldKot$delegate) {
        boolean z;
        Map linkedHashMap = new LinkedHashMap();
        for (Map.Entry entry : ((Map) $selectedOldKotItems).entrySet()) {
            if (((Boolean) entry.getValue()).booleanValue()) {
                linkedHashMap.put(entry.getKey(), entry.getValue());
            }
        }
        Set selectedIndices = linkedHashMap.keySet();
        if (selectedIndices.isEmpty()) {
            Toast.makeText($context, "No items selected!", 0).show();
        } else {
            Set set = selectedIndices;
            if (!(set instanceof Collection) || !set.isEmpty()) {
                Iterator it = set.iterator();
                while (true) {
                    if (it.hasNext()) {
                        String str = (String) $oldKotItemReasons.get(Integer.valueOf(((Number) it.next()).intValue()));
                        if (str == null) {
                            str = "";
                        }
                        if (StringsKt.isBlank(str)) {
                            z = true;
                            break;
                        }
                    } else {
                        z = false;
                        break;
                    }
                }
            } else {
                z = false;
            }
            boolean missingReason = z;
            if (missingReason) {
                Toast.makeText($context, "Please provide a reason for all cancelled items!", 0).show();
            } else {
                Set set2 = selectedIndices;
                Collection arrayList = new ArrayList(CollectionsKt.collectionSizeOrDefault(set2, 10));
                Iterator it2 = set2.iterator();
                while (it2.hasNext()) {
                    arrayList.add((MenuItem) ((Map.Entry) $oldKotEntries.get(((Number) it2.next()).intValue())).getKey());
                }
                Set selected = CollectionsKt.toSet((List) arrayList);
                $billingViewModel.removeOldKotItems(selected);
                $selectedOldKotItems.clear();
                $oldKotItemReasons.clear();
                OldKotDialog$lambda$4($selectAllOldKot$delegate, false);
                Toast.makeText($context, "Selected items cancelled", 0).show();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit OldKotDialog$lambda$6$0$0$5$0$3(long $dkTextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1999@101676L155:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1751794944, $changed, -1, "com.example.sasloopmanager.OldKotDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1999)");
            }
            TextKt.Text-Nvy7gAk("Cancel KOT", PaddingKt.padding-VpY3zN4(Modifier.Companion, Dp.constructor-impl(10), Dp.constructor-impl(6)), $dkTextPrimary, (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597878, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit OldKotDialog$lambda$6$0$0$5$1$0(Function0 $onDismissRequest, SnapshotStateMap $selectedOldKotItems, SnapshotStateMap $oldKotItemReasons, MutableState $selectAllOldKot$delegate) {
        $onDismissRequest.invoke();
        $selectedOldKotItems.clear();
        $oldKotItemReasons.clear();
        OldKotDialog$lambda$4($selectAllOldKot$delegate, false);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void SplitBillDialog(@NotNull Function0<Unit> function0, @NotNull Map<MenuItem, Integer> map, @NotNull PosSettings posSettings, @NotNull String orderType, @NotNull String discountInput, @NotNull String serviceChargeInput, @NotNull String deliveryChargeInput, boolean isComplimentaryOrder, @NotNull Context context, @Nullable Composer $composer, int $changed) {
        double d;
        Intrinsics.checkNotNullParameter(function0, "onDismissRequest");
        Intrinsics.checkNotNullParameter(map, "billingItems");
        Intrinsics.checkNotNullParameter(posSettings, "posSettings");
        Intrinsics.checkNotNullParameter(orderType, "orderType");
        Intrinsics.checkNotNullParameter(discountInput, "discountInput");
        Intrinsics.checkNotNullParameter(serviceChargeInput, "serviceChargeInput");
        Intrinsics.checkNotNullParameter(deliveryChargeInput, "deliveryChargeInput");
        Intrinsics.checkNotNullParameter(context, "context");
        Composer $composer2 = $composer.startRestartGroup(-1342511217);
        ComposerKt.sourceInformation($composer2, "C(SplitBillDialog)N(onDismissRequest,billingItems,posSettings,orderType,discountInput,serviceChargeInput,deliveryChargeInput,isComplimentaryOrder,context)2033@103027L11,2034@103086L11,2035@103140L11,2036@103203L11,2037@103266L11,2060@104294L10554,2060@104250L10598:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changedInstance(map) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= ($changed & 512) == 0 ? $composer2.changed(posSettings) : $composer2.changedInstance(posSettings) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(orderType) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changed(discountInput) ? 16384 : 8192;
        }
        if (($changed & 196608) == 0) {
            $dirty |= $composer2.changed(serviceChargeInput) ? 131072 : 65536;
        }
        if (($changed & 1572864) == 0) {
            $dirty |= $composer2.changed(deliveryChargeInput) ? 1048576 : 524288;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= $composer2.changed(isComplimentaryOrder) ? 8388608 : 4194304;
        }
        if (($changed & 100663296) == 0) {
            $dirty |= $composer2.changedInstance(context) ? 67108864 : 33554432;
        }
        if ($composer2.shouldExecute(($dirty & 38347923) != 38347922, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1342511217, $dirty, -1, "com.example.sasloopmanager.SplitBillDialog (BillingScreen.kt:2032)");
            }
            long CardDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface-0d7_KjU();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurfaceVariant-0d7_KjU();
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnBackground-0d7_KjU();
            long TextSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            double d2 = 0.0d;
            Iterator<T> it = map.entrySet().iterator();
            while (it.hasNext()) {
                d2 += ((MenuItem) ((Map.Entry) it.next()).getKey()).getPrice() * ((Number) r1.getValue()).intValue();
            }
            double subtotal = d2;
            Double doubleOrNull = StringsKt.toDoubleOrNull(discountInput);
            double discount = doubleOrNull != null ? doubleOrNull.doubleValue() : 0.0d;
            Double doubleOrNull2 = StringsKt.toDoubleOrNull(serviceChargeInput);
            double serviceCharge = doubleOrNull2 != null ? doubleOrNull2.doubleValue() : 0.0d;
            if (Intrinsics.areEqual(orderType, "DELIVERY")) {
                Double doubleOrNull3 = StringsKt.toDoubleOrNull(deliveryChargeInput);
                d = doubleOrNull3 != null ? doubleOrNull3.doubleValue() : 0.0d;
            } else {
                d = 0.0d;
            }
            double deliveryCharge = d;
            double taxRate = posSettings.getTaxRate();
            boolean isInclusive = posSettings.isTaxInclusive();
            double taxableAmount = RangesKt.coerceAtLeast(subtotal - discount, 0.0d);
            double computedTax = isInclusive ? taxableAmount * (taxRate / (100.0d + taxRate)) : taxableAmount * (taxRate / 100.0d);
            double cgst = computedTax / 2.0d;
            double sgst = computedTax / 2.0d;
            double calculatedTotal = isInclusive ? taxableAmount + serviceCharge + deliveryCharge : taxableAmount + cgst + sgst + serviceCharge + deliveryCharge;
            double finalTotal = isComplimentaryOrder ? 0.0d : calculatedTotal;
            AndroidDialog_androidKt.Dialog(function0, (DialogProperties) null, ComposableLambdaKt.rememberComposableLambda(-1405394202, true, (v10, v11) -> {
                return SplitBillDialog$lambda$1(r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, v10, v11);
            }, $composer2, 54), $composer2, 384 | (14 & $dirty), 2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer2.skipToGroupEnd();
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v10, v11) -> {
                return SplitBillDialog$lambda$2(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, v10, v11);
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit SplitBillDialog$lambda$1(long $CardDark, long $CardBorderDark, PosSettings $posSettings, double $finalTotal, long $InputDark, Map $billingItems, long $TextSecondary, Function0 $onDismissRequest, Context $context, long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2063@104391L37,2066@104559L10283,2061@104304L10538:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1405394202, $changed, -1, "com.example.sasloopmanager.SplitBillDialog.<anonymous> (BillingScreen.kt:2061)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(1261423064, true, (v9, v10, v11) -> {
                return SplitBillDialog$lambda$1$0(r7, r8, r9, r10, r11, r12, r13, r14, r15, v9, v10, v11);
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit SplitBillDialog$lambda$1$0(PosSettings $posSettings, double $finalTotal, long $InputDark, Map $billingItems, long $CardDark, long $TextSecondary, Function0 $onDismissRequest, Context $context, long $TextPrimary, ColumnScope $this$Card, Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        Object obj3;
        Object obj4;
        Object obj5;
        Object obj6;
        Object obj7;
        Object obj8;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C2067@104573L10259:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1261423064, $changed, -1, "com.example.sasloopmanager.SplitBillDialog.<anonymous>.<anonymous> (BillingScreen.kt:2067)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16));
            Alignment.Horizontal centerHorizontally = Alignment.Companion.getCenterHorizontally();
            Arrangement.Vertical vertical = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(vertical, centerHorizontally, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, 191912946, "C2072@104799L265,2079@105098L30,2086@105400L928,2081@105146L1182,2220@113805L1013:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("Split Bill (Total: " + $posSettings.getCurrency() + " " + formatPrice($finalTotal, $posSettings) + ")", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(16), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerStart($composer, 976021644, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                Object mutableStateOf$default = SnapshotStateKt.mutableStateOf$default(0, (SnapshotMutationPolicy) null, 2, (Object) null);
                $composer.updateRememberedValue(mutableStateOf$default);
                obj = mutableStateOf$default;
            } else {
                obj = rememberedValue;
            }
            MutableState mutableState = (MutableState) obj;
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabRowKt.TabRow-pAZo6Ak(SplitBillDialog$lambda$1$0$0$1(mutableState), ClipKt.clip(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8))), $InputDark, ColorKt.getSaSGreen(), (Function3) null, (Function2) null, ComposableLambdaKt.rememberComposableLambda(1169780198, true, (v2, v3) -> {
                return SplitBillDialog$lambda$1$0$0$3(r8, r9, v2, v3);
            }, $composer, 54), $composer, 1572864, 48);
            if (SplitBillDialog$lambda$1$0$0$1(mutableState) != 0) {
                if (SplitBillDialog$lambda$1$0$0$1(mutableState) != 1) {
                    $composer.startReplaceGroup(196262183);
                    ComposerKt.sourceInformation($composer, "2150@109402L49,2156@109729L2667,2153@109539L2857,2214@113298L471");
                    ComposerKt.sourceInformationMarkerStart($composer, 976159391, "CC(remember):BillingScreen.kt#9igjgp");
                    Object rememberedValue2 = $composer.rememberedValue();
                    if (rememberedValue2 == Composer.Companion.getEmpty()) {
                        Object mutableStateMapOf = SnapshotStateKt.mutableStateMapOf();
                        $composer.updateRememberedValue(mutableStateMapOf);
                        obj2 = mutableStateMapOf;
                    } else {
                        obj2 = rememberedValue2;
                    }
                    SnapshotStateMap snapshotStateMap = (SnapshotStateMap) obj2;
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    List list = CollectionsKt.toList($billingItems.entrySet());
                    Modifier modifier2 = SizeKt.heightIn-VpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(160), 1, (Object) null);
                    LazyListState lazyListState = null;
                    PaddingValues paddingValues = null;
                    boolean z = false;
                    Arrangement.Vertical vertical2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(6));
                    Alignment.Horizontal horizontal = null;
                    FlingBehavior flingBehavior = null;
                    boolean z2 = false;
                    OverscrollEffect overscrollEffect = null;
                    ComposerKt.sourceInformationMarkerStart($composer, 976172473, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changedInstance = $composer.changedInstance(list) | $composer.changed($InputDark) | $composer.changed($CardDark);
                    Object rememberedValue3 = $composer.rememberedValue();
                    if (changedInstance || rememberedValue3 == Composer.Companion.getEmpty()) {
                        Object obj9 = (v4) -> {
                            return SplitBillDialog$lambda$1$0$0$13$0(r0, r1, r2, r3, v4);
                        };
                        modifier2 = modifier2;
                        lazyListState = null;
                        paddingValues = null;
                        z = false;
                        vertical2 = vertical2;
                        horizontal = null;
                        flingBehavior = null;
                        z2 = false;
                        overscrollEffect = null;
                        $composer.updateRememberedValue(obj9);
                        obj3 = obj9;
                    } else {
                        obj3 = rememberedValue3;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    LazyDslKt.LazyColumn(modifier2, lazyListState, paddingValues, z, vertical2, horizontal, flingBehavior, z2, overscrollEffect, (Function1) obj3, $composer, 24582, 494);
                    double d = 0.0d;
                    for (Object obj10 : list) {
                        double d2 = d;
                        Map.Entry entry = (Map.Entry) obj10;
                        MenuItem menuItem = (MenuItem) entry.getKey();
                        int intValue = ((Number) entry.getValue()).intValue();
                        int id = menuItem.getId();
                        List selectedModifiers = menuItem.getSelectedModifiers();
                        int hashCode2 = selectedModifiers != null ? selectedModifiers.hashCode() : 0;
                        String kitchenNote = menuItem.getKitchenNote();
                        Boolean bool = (Boolean) snapshotStateMap.get(id + "_" + hashCode2 + "_" + (kitchenNote != null ? kitchenNote.hashCode() : 0));
                        d = d2 + (!(bool != null ? bool.booleanValue() : false) ? menuItem.getPrice() * intValue : 0.0d);
                    }
                    double d3 = d;
                    double d4 = 0.0d;
                    for (Object obj11 : list) {
                        double d5 = d4;
                        Map.Entry entry2 = (Map.Entry) obj11;
                        MenuItem menuItem2 = (MenuItem) entry2.getKey();
                        int intValue2 = ((Number) entry2.getValue()).intValue();
                        int id2 = menuItem2.getId();
                        List selectedModifiers2 = menuItem2.getSelectedModifiers();
                        int hashCode3 = selectedModifiers2 != null ? selectedModifiers2.hashCode() : 0;
                        String kitchenNote2 = menuItem2.getKitchenNote();
                        Boolean bool2 = (Boolean) snapshotStateMap.get(id2 + "_" + hashCode3 + "_" + (kitchenNote2 != null ? kitchenNote2.hashCode() : 0));
                        d4 = d5 + (bool2 != null ? bool2.booleanValue() : false ? menuItem2.getPrice() * intValue2 : 0.0d);
                    }
                    double d6 = d4;
                    Arrangement.Vertical vertical3 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(4));
                    Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
                    ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                    MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(vertical3, Alignment.Companion.getStart(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
                    ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                    CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
                    Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default);
                    Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
                    int i4 = 6 | (896 & ((112 & (54 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer.startReusableNode();
                    if ($composer.getInserting()) {
                        $composer.createNode(constructor2);
                    } else {
                        $composer.useNode();
                    }
                    Composer composer2 = Updater.constructor-impl($composer);
                    Updater.set-impl(composer2, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer2, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
                    int i5 = 14 & (i4 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                    ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
                    int i6 = 6 | (112 & (54 >> 6));
                    ComposerKt.sourceInformationMarkerStart($composer, -1250813103, "C2215@113417L150,2216@113592L155:BillingScreen.kt#7ez3px");
                    TextKt.Text-Nvy7gAk("Bill A Subtotal: " + $posSettings.getCurrency() + " " + formatPrice(d3, $posSettings), (Modifier) null, ColorKt.getSaSGreen(), (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
                    TextKt.Text-Nvy7gAk("Bill B Subtotal: " + $posSettings.getCurrency() + " " + formatPrice(d6, $posSettings), (Modifier) null, ColorKt.getSaSGreenLight(), (TextAutoSize) null, TextUnitKt.getSp(12), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endReplaceGroup();
                } else {
                    $composer.startReplaceGroup(194791791);
                    ComposerKt.sourceInformation($composer, "2131@108013L33,2136@108249L1085");
                    ComposerKt.sourceInformationMarkerStart($composer, 976114927, "CC(remember):BillingScreen.kt#9igjgp");
                    Object rememberedValue4 = $composer.rememberedValue();
                    if (rememberedValue4 == Composer.Companion.getEmpty()) {
                        Object mutableStateOf$default2 = SnapshotStateKt.mutableStateOf$default("50", (SnapshotMutationPolicy) null, 2, (Object) null);
                        $composer.updateRememberedValue(mutableStateOf$default2);
                        obj4 = mutableStateOf$default2;
                    } else {
                        obj4 = rememberedValue4;
                    }
                    MutableState mutableState2 = (MutableState) obj4;
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    Double doubleOrNull = StringsKt.toDoubleOrNull(SplitBillDialog$lambda$1$0$0$9(mutableState2));
                    double doubleValue = doubleOrNull != null ? doubleOrNull.doubleValue() : 50.0d;
                    double d7 = $finalTotal * (doubleValue / 100.0d);
                    double d8 = $finalTotal - d7;
                    Arrangement.Vertical vertical4 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                    Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
                    ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                    MeasurePolicy columnMeasurePolicy3 = ColumnKt.columnMeasurePolicy(vertical4, Alignment.Companion.getStart(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
                    ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                    CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
                    Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default2);
                    Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
                    int i7 = 6 | (896 & ((112 & (54 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer.startReusableNode();
                    if ($composer.getInserting()) {
                        $composer.createNode(constructor3);
                    } else {
                        $composer.useNode();
                    }
                    Composer composer3 = Updater.constructor-impl($composer);
                    Updater.set-impl(composer3, columnMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer3, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
                    int i8 = 14 & (i7 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                    ColumnScope columnScope3 = ColumnScopeInstance.INSTANCE;
                    int i9 = 6 | (112 & (54 >> 6));
                    ComposerKt.sourceInformationMarkerStart($composer, -2138501173, "C2137@108368L76,2140@108581L21,2138@108469L370,2145@108864L29,2146@108918L178,2147@109121L191:BillingScreen.kt#7ez3px");
                    TextKt.Text-Nvy7gAk("Enter percentage for Share 1:", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24966, 0, 262122);
                    String SplitBillDialog$lambda$1$0$0$9 = SplitBillDialog$lambda$1$0$0$9(mutableState2);
                    KeyboardOptions keyboardOptions = new KeyboardOptions(0, (Boolean) null, KeyboardType.Companion.getNumber-PjHm6EE(), 0, (PlatformImeOptions) null, (Boolean) null, (LocaleList) null, 123, (DefaultConstructorMarker) null);
                    Modifier fillMaxWidth$default3 = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
                    String str = SplitBillDialog$lambda$1$0$0$9;
                    ComposerKt.sourceInformationMarkerStart($composer, 900853309, "CC(remember):BillingScreen.kt#9igjgp");
                    Object rememberedValue5 = $composer.rememberedValue();
                    if (rememberedValue5 == Composer.Companion.getEmpty()) {
                        Object obj12 = (v1) -> {
                            return SplitBillDialog$lambda$1$0$0$11$0$0(r0, v1);
                        };
                        str = str;
                        $composer.updateRememberedValue(obj12);
                        obj5 = obj12;
                    } else {
                        obj5 = rememberedValue5;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    m2CompactTextField03iij_k(str, (Function1) obj5, "50", fillMaxWidth$default3, keyboardOptions, false, 0L, null, $composer, 28080, 224);
                    SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(4)), $composer, 6);
                    TextKt.Text-Nvy7gAk("Share 1 (" + formatPrice(doubleValue, $posSettings) + "%): " + $posSettings.getCurrency() + " " + formatPrice(d7, $posSettings), (Modifier) null, ColorKt.getSaSGreen(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
                    TextKt.Text-Nvy7gAk("Share 2 (" + formatPrice(100.0d - doubleValue, $posSettings) + "%): " + $posSettings.getCurrency() + " " + formatPrice(d8, $posSettings), (Modifier) null, ColorKt.getSaSGreenLight(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endReplaceGroup();
                }
            } else {
                $composer.startReplaceGroup(193204839);
                ComposerKt.sourceInformation($composer, "2105@106403L30,2106@106454L1474");
                ComposerKt.sourceInformationMarkerStart($composer, 976063404, "CC(remember):BillingScreen.kt#9igjgp");
                Object rememberedValue6 = $composer.rememberedValue();
                if (rememberedValue6 == Composer.Companion.getEmpty()) {
                    Object mutableStateOf$default3 = SnapshotStateKt.mutableStateOf$default(2, (SnapshotMutationPolicy) null, 2, (Object) null);
                    $composer.updateRememberedValue(mutableStateOf$default3);
                    obj7 = mutableStateOf$default3;
                } else {
                    obj7 = rememberedValue6;
                }
                MutableState mutableState3 = (MutableState) obj7;
                ComposerKt.sourceInformationMarkerEnd($composer);
                Arrangement.Vertical vertical5 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(10));
                Modifier fillMaxWidth$default4 = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
                ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                MeasurePolicy columnMeasurePolicy4 = ColumnKt.columnMeasurePolicy(vertical5, Alignment.Companion.getStart(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default4);
                Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
                int i10 = 6 | (896 & ((112 & (54 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor4);
                } else {
                    $composer.useNode();
                }
                Composer composer4 = Updater.constructor-impl($composer);
                Updater.set-impl(composer4, columnMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer4, Integer.valueOf(hashCode6), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
                int i11 = 14 & (i10 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                ColumnScope columnScope4 = ColumnScopeInstance.INSTANCE;
                int i12 = 6 | (112 & (54 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer, -342219376, "C2107@106574L76,2108@106675L836,2122@107536L29,2123@107590L316:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk("Number of portions: " + SplitBillDialog$lambda$1$0$0$5(mutableState3), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 24960, 0, 262122);
                Arrangement.Horizontal horizontal2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                Modifier modifier3 = Modifier.Companion;
                MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(horizontal2, Alignment.Companion.getTop(), $composer, (14 & (48 >> 3)) | (112 & (48 >> 3)));
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode7 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap5 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer, modifier3);
                Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                int i13 = 6 | (896 & ((112 & (48 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor5);
                } else {
                    $composer.useNode();
                }
                Composer composer5 = Updater.constructor-impl($composer);
                Updater.set-impl(composer5, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer5, Integer.valueOf(hashCode7), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                int i14 = 14 & (i13 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                int i15 = 6 | (112 & (48 >> 6));
                RowScope rowScope = RowScopeInstance.INSTANCE;
                ComposerKt.sourceInformationMarkerStart($composer, 41784204, "C:BillingScreen.kt#7ez3px");
                $composer.startReplaceGroup(1663916080);
                ComposerKt.sourceInformation($composer, "*2114@107105L18,2110@106817L638");
                IntIterator it = new IntRange(2, 5).iterator();
                while (it.hasNext()) {
                    int nextInt = it.nextInt();
                    Modifier modifier4 = BackgroundKt.background-bw27NRU(RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null), SplitBillDialog$lambda$1$0$0$5(mutableState3) == nextInt ? ColorKt.getSaSGreen() : $InputDark, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8)));
                    boolean z3 = false;
                    String str2 = null;
                    Role role = null;
                    MutableInteractionSource mutableInteractionSource = null;
                    ComposerKt.sourceInformationMarkerStart($composer, 1258585869, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changed = $composer.changed(nextInt);
                    Object rememberedValue7 = $composer.rememberedValue();
                    if (changed || rememberedValue7 == Composer.Companion.getEmpty()) {
                        Object obj13 = () -> {
                            return SplitBillDialog$lambda$1$0$0$7$0$0$0$0(r0, r1);
                        };
                        modifier4 = modifier4;
                        z3 = false;
                        str2 = null;
                        role = null;
                        mutableInteractionSource = null;
                        $composer.updateRememberedValue(obj13);
                        obj8 = obj13;
                    } else {
                        obj8 = rememberedValue7;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    Modifier modifier5 = PaddingKt.padding-VpY3zN4$default(ClickableKt.clickable-oSLSa3U$default(modifier4, z3, str2, role, mutableInteractionSource, (Function0) obj8, 15, (Object) null), 0.0f, Dp.constructor-impl(8), 1, (Object) null);
                    Alignment center = Alignment.Companion.getCenter();
                    ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                    MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                    ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode8 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                    CompositionLocalMap currentCompositionLocalMap6 = $composer.getCurrentCompositionLocalMap();
                    Modifier materializeModifier6 = ComposedModifierKt.materializeModifier($composer, modifier5);
                    Function0 constructor6 = ComposeUiNode.Companion.getConstructor();
                    int i16 = 6 | (896 & ((112 & (48 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer.startReusableNode();
                    if ($composer.getInserting()) {
                        $composer.createNode(constructor6);
                    } else {
                        $composer.useNode();
                    }
                    Composer composer6 = Updater.constructor-impl($composer);
                    Updater.set-impl(composer6, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer6, currentCompositionLocalMap6, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer6, Integer.valueOf(hashCode8), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer6, materializeModifier6, ComposeUiNode.Companion.getSetModifier());
                    int i17 = 14 & (i16 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                    BoxScope boxScope = BoxScopeInstance.INSTANCE;
                    int i18 = 6 | (112 & (48 >> 6));
                    ComposerKt.sourceInformationMarkerStart($composer, 2038999148, "C2118@107335L86:BillingScreen.kt#7ez3px");
                    TextKt.Text-Nvy7gAk(nextInt + " Ways", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                }
                $composer.endReplaceGroup();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(4)), $composer, 6);
                TextKt.Text-Nvy7gAk("Each person pays: " + $posSettings.getCurrency() + " " + formatPrice($finalTotal / SplitBillDialog$lambda$1$0$0$5(mutableState3), $posSettings), (Modifier) null, ColorKt.getSaSGreenLight(), (TextAutoSize) null, TextUnitKt.getSp(14), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endReplaceGroup();
            }
            Modifier modifier6 = PaddingKt.padding-qDBjuR0$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(8), 0.0f, 0.0f, 13, (Object) null);
            Arrangement.Horizontal horizontal3 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(horizontal3, Alignment.Companion.getTop(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode9 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap7 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier7 = ComposedModifierKt.materializeModifier($composer, modifier6);
            Function0 constructor7 = ComposeUiNode.Companion.getConstructor();
            int i19 = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor7);
            } else {
                $composer.useNode();
            }
            Composer composer7 = Updater.constructor-impl($composer);
            Updater.set-impl(composer7, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer7, currentCompositionLocalMap7, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer7, Integer.valueOf(hashCode9), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer7, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer7, materializeModifier7, ComposeUiNode.Companion.getSetModifier());
            int i20 = 14 & (i19 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i21 = 6 | (112 & (54 >> 6));
            RowScope rowScope2 = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, -1222836082, "C2226@114105L40,2228@114224L83,2224@113997L310,2236@114600L39,2232@114370L180,2231@114328L472:BillingScreen.kt#7ez3px");
            ButtonKt.Button($onDismissRequest, RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null), false, (Shape) null, ButtonDefaults.INSTANCE.buttonColors-ro_MJ88($InputDark, 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14), (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableLambdaKt.rememberComposableLambda(427512994, true, (v1, v2, v3) -> {
                return SplitBillDialog$lambda$1$0$0$17$0(r11, v1, v2, v3);
            }, $composer, 54), $composer, 805306368, 492);
            ButtonColors buttonColors = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14);
            Modifier weight$default = RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, -1840550330, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed2 = $composer.changed($onDismissRequest) | $composer.changedInstance($context);
            Object rememberedValue8 = $composer.rememberedValue();
            if (changed2 || rememberedValue8 == Composer.Companion.getEmpty()) {
                Object obj14 = () -> {
                    return SplitBillDialog$lambda$1$0$0$17$1$0(r0, r1);
                };
                $composer.updateRememberedValue(obj14);
                obj6 = obj14;
            } else {
                obj6 = rememberedValue8;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.Button((Function0) obj6, weight$default, false, (Shape) null, buttonColors, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-1551240679$app(), $composer, 805306368, 492);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final int SplitBillDialog$lambda$1$0$0$1(MutableState<Integer> mutableState) {
        return ((Number) ((State) mutableState).getValue()).intValue();
    }

    private static final void SplitBillDialog$lambda$1$0$0$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit SplitBillDialog$lambda$1$0$0$3(MutableState $splitTab$delegate, long $TextSecondary, Composer $composer, int $changed) {
        Object obj;
        Object obj2;
        Object obj3;
        ComposerKt.sourceInformation($composer, "C2089@105511L16,2090@105560L123,2087@105422L283,2094@105815L16,2095@105864L123,2092@105726L283,2099@106119L16,2100@106168L120,2097@106030L280:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1169780198, $changed, -1, "com.example.sasloopmanager.SplitBillDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2087)");
            }
            boolean z = SplitBillDialog$lambda$1$0$0$1($splitTab$delegate) == 0;
            ComposerKt.sourceInformationMarkerStart($composer, -1122657706, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.Companion.getEmpty()) {
                boolean z2 = z;
                Object obj4 = () -> {
                    return SplitBillDialog$lambda$1$0$0$3$0$0(r0);
                };
                z = z2;
                $composer.updateRememberedValue(obj4);
                obj = obj4;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z, (Function0) obj, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(1358465356, true, (v2, v3) -> {
                return SplitBillDialog$lambda$1$0$0$3$1(r6, r7, v2, v3);
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            boolean z3 = SplitBillDialog$lambda$1$0$0$1($splitTab$delegate) == 1;
            ComposerKt.sourceInformationMarkerStart($composer, -1122647978, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer.rememberedValue();
            if (rememberedValue2 == Composer.Companion.getEmpty()) {
                boolean z4 = z3;
                Object obj5 = () -> {
                    return SplitBillDialog$lambda$1$0$0$3$2$0(r0);
                };
                z3 = z4;
                $composer.updateRememberedValue(obj5);
                obj2 = obj5;
            } else {
                obj2 = rememberedValue2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z3, (Function0) obj2, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(770524803, true, (v2, v3) -> {
                return SplitBillDialog$lambda$1$0$0$3$3(r6, r7, v2, v3);
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            boolean z5 = SplitBillDialog$lambda$1$0$0$1($splitTab$delegate) == 2;
            ComposerKt.sourceInformationMarkerStart($composer, -1122638250, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue3 = $composer.rememberedValue();
            if (rememberedValue3 == Composer.Companion.getEmpty()) {
                boolean z6 = z5;
                Object obj6 = () -> {
                    return SplitBillDialog$lambda$1$0$0$3$4$0(r0);
                };
                z5 = z6;
                $composer.updateRememberedValue(obj6);
                obj3 = obj6;
            } else {
                obj3 = rememberedValue3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.Tab-wqdebIU(z5, (Function0) obj3, (Modifier) null, false, ComposableLambdaKt.rememberComposableLambda(-1891544764, true, (v2, v3) -> {
                return SplitBillDialog$lambda$1$0$0$3$5(r6, r7, v2, v3);
            }, $composer, 54), (Function2) null, 0L, 0L, (MutableInteractionSource) null, $composer, 24624, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit SplitBillDialog$lambda$1$0$0$3$0$0(MutableState $splitTab$delegate) {
        SplitBillDialog$lambda$1$0$0$2($splitTab$delegate, 0);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit SplitBillDialog$lambda$1$0$0$3$1(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2090@105562L119:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1358465356, $changed, -1, "com.example.sasloopmanager.SplitBillDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2090)");
            }
            TextKt.Text-Nvy7gAk("Portion", (Modifier) null, SplitBillDialog$lambda$1$0$0$1($splitTab$delegate) == 0 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit SplitBillDialog$lambda$1$0$0$3$2$0(MutableState $splitTab$delegate) {
        SplitBillDialog$lambda$1$0$0$2($splitTab$delegate, 1);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit SplitBillDialog$lambda$1$0$0$3$3(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2095@105866L119:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(770524803, $changed, -1, "com.example.sasloopmanager.SplitBillDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2095)");
            }
            TextKt.Text-Nvy7gAk("Percent", (Modifier) null, SplitBillDialog$lambda$1$0$0$1($splitTab$delegate) == 1 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit SplitBillDialog$lambda$1$0$0$3$4$0(MutableState $splitTab$delegate) {
        SplitBillDialog$lambda$1$0$0$2($splitTab$delegate, 2);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit SplitBillDialog$lambda$1$0$0$3$5(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2100@106170L116:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1891544764, $changed, -1, "com.example.sasloopmanager.SplitBillDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2100)");
            }
            TextKt.Text-Nvy7gAk("Item", (Modifier) null, SplitBillDialog$lambda$1$0$0$1($splitTab$delegate) == 2 ? ColorKt.getSaSGreen() : $TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final int SplitBillDialog$lambda$1$0$0$5(MutableState<Integer> mutableState) {
        return ((Number) ((State) mutableState).getValue()).intValue();
    }

    private static final void SplitBillDialog$lambda$1$0$0$6(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    private static final Unit SplitBillDialog$lambda$1$0$0$7$0$0$0$0(int $num, MutableState $portions$delegate) {
        SplitBillDialog$lambda$1$0$0$6($portions$delegate, $num);
        return Unit.INSTANCE;
    }

    private static final String SplitBillDialog$lambda$1$0$0$9(MutableState<String> mutableState) {
        return (String) ((State) mutableState).getValue();
    }

    private static final Unit SplitBillDialog$lambda$1$0$0$11$0$0(MutableState $percentInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $percentInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    private static final Unit SplitBillDialog$lambda$1$0$0$13$0(List $itemsList, SnapshotStateMap $itemAssignments, long $InputDark, long $CardDark, LazyListScope $this$LazyColumn) {
        Intrinsics.checkNotNullParameter($this$LazyColumn, "$this$LazyColumn");
        $this$LazyColumn.items($itemsList.size(), (Function1) null, new BillingScreenKt$SplitBillDialog$lambda$1$0$0$13$0$.inlined.items.default.3(BillingScreenKt$SplitBillDialog$lambda$1$0$0$13$0$.inlined.items.default.1.INSTANCE, $itemsList), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$SplitBillDialog$lambda$1$0$0$13$0$.inlined.items.default.4($itemsList, $itemAssignments, $InputDark, $CardDark)));
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit SplitBillDialog$lambda$1$0$0$17$0(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2229@114250L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(427512994, $changed, -1, "com.example.sasloopmanager.SplitBillDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2229)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit SplitBillDialog$lambda$1$0$0$17$1$0(Function0 $onDismissRequest, Context $context) {
        $onDismissRequest.invoke();
        Toast.makeText($context, "Bill split successfully", 0).show();
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void PaymentDialog(@NotNull Function0<Unit> function0, @NotNull Map<MenuItem, Integer> map, @NotNull String discountInput, @NotNull String serviceChargeInput, @NotNull String deliveryChargeInput, @NotNull PosSettings posSettings, @NotNull String orderType, boolean isComplimentaryOrder, @NotNull String advancePaidInput, @NotNull String paymentMethod, @NotNull Function1<? super String, Unit> function1, @NotNull String customerName, @NotNull String customerPhone, @NotNull String selectedDialCode, @NotNull String customerAddress, @NotNull String activeFlow, @NotNull String preOrderDate, @NotNull String preOrderTime, @NotNull String preOrderTypeInput, @NotNull String preOrderIdInput, @Nullable TableItem selectedTable, @Nullable String selectedWaiter, @Nullable UserProfile user, @NotNull BillingViewModel billingViewModel, @NotNull Context context, @Nullable Composer $composer, int $changed, int $changed1, int $changed2) {
        Intrinsics.checkNotNullParameter(function0, "onDismissRequest");
        Intrinsics.checkNotNullParameter(map, "billingItems");
        Intrinsics.checkNotNullParameter(discountInput, "discountInput");
        Intrinsics.checkNotNullParameter(serviceChargeInput, "serviceChargeInput");
        Intrinsics.checkNotNullParameter(deliveryChargeInput, "deliveryChargeInput");
        Intrinsics.checkNotNullParameter(posSettings, "posSettings");
        Intrinsics.checkNotNullParameter(orderType, "orderType");
        Intrinsics.checkNotNullParameter(advancePaidInput, "advancePaidInput");
        Intrinsics.checkNotNullParameter(paymentMethod, "paymentMethod");
        Intrinsics.checkNotNullParameter(function1, "onPaymentMethodChange");
        Intrinsics.checkNotNullParameter(customerName, "customerName");
        Intrinsics.checkNotNullParameter(customerPhone, "customerPhone");
        Intrinsics.checkNotNullParameter(selectedDialCode, "selectedDialCode");
        Intrinsics.checkNotNullParameter(customerAddress, "customerAddress");
        Intrinsics.checkNotNullParameter(activeFlow, "activeFlow");
        Intrinsics.checkNotNullParameter(preOrderDate, "preOrderDate");
        Intrinsics.checkNotNullParameter(preOrderTime, "preOrderTime");
        Intrinsics.checkNotNullParameter(preOrderTypeInput, "preOrderTypeInput");
        Intrinsics.checkNotNullParameter(preOrderIdInput, "preOrderIdInput");
        Intrinsics.checkNotNullParameter(billingViewModel, "billingViewModel");
        Intrinsics.checkNotNullParameter(context, "context");
        Composer $composer2 = $composer.startRestartGroup(-1501510425);
        ComposerKt.sourceInformation($composer2, "C(PaymentDialog)N(onDismissRequest,billingItems,discountInput,serviceChargeInput,deliveryChargeInput,posSettings,orderType,isComplimentaryOrder,advancePaidInput,paymentMethod,onPaymentMethodChange,customerName,customerPhone,selectedDialCode,customerAddress,activeFlow,preOrderDate,preOrderTime,preOrderTypeInput,preOrderIdInput,selectedTable,selectedWaiter,user,billingViewModel,context)2275@115795L11,2276@115854L11,2277@115908L11,2278@115971L11,2279@116034L11,2281@116112L8081,2281@116068L8125:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int $dirty1 = $changed1;
        int $dirty2 = $changed2;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changedInstance(map) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changed(discountInput) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(serviceChargeInput) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changed(deliveryChargeInput) ? 16384 : 8192;
        }
        if (($changed & 196608) == 0) {
            $dirty |= ($changed & 262144) == 0 ? $composer2.changed(posSettings) : $composer2.changedInstance(posSettings) ? 131072 : 65536;
        }
        if (($changed & 1572864) == 0) {
            $dirty |= $composer2.changed(orderType) ? 1048576 : 524288;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= $composer2.changed(isComplimentaryOrder) ? 8388608 : 4194304;
        }
        if (($changed & 100663296) == 0) {
            $dirty |= $composer2.changed(advancePaidInput) ? 67108864 : 33554432;
        }
        if (($changed & 805306368) == 0) {
            $dirty |= $composer2.changed(paymentMethod) ? 536870912 : 268435456;
        }
        if (($changed1 & 6) == 0) {
            $dirty1 |= $composer2.changedInstance(function1) ? 4 : 2;
        }
        if (($changed1 & 48) == 0) {
            $dirty1 |= $composer2.changed(customerName) ? 32 : 16;
        }
        if (($changed1 & 384) == 0) {
            $dirty1 |= $composer2.changed(customerPhone) ? 256 : 128;
        }
        if (($changed1 & 3072) == 0) {
            $dirty1 |= $composer2.changed(selectedDialCode) ? 2048 : 1024;
        }
        if (($changed1 & 24576) == 0) {
            $dirty1 |= $composer2.changed(customerAddress) ? 16384 : 8192;
        }
        if (($changed1 & 196608) == 0) {
            $dirty1 |= $composer2.changed(activeFlow) ? 131072 : 65536;
        }
        if (($changed1 & 1572864) == 0) {
            $dirty1 |= $composer2.changed(preOrderDate) ? 1048576 : 524288;
        }
        if (($changed1 & 12582912) == 0) {
            $dirty1 |= $composer2.changed(preOrderTime) ? 8388608 : 4194304;
        }
        if (($changed1 & 100663296) == 0) {
            $dirty1 |= $composer2.changed(preOrderTypeInput) ? 67108864 : 33554432;
        }
        if (($changed1 & 805306368) == 0) {
            $dirty1 |= $composer2.changed(preOrderIdInput) ? 536870912 : 268435456;
        }
        if (($changed2 & 6) == 0) {
            $dirty2 |= $composer2.changed(selectedTable) ? 4 : 2;
        }
        if (($changed2 & 48) == 0) {
            $dirty2 |= $composer2.changed(selectedWaiter) ? 32 : 16;
        }
        if (($changed2 & 384) == 0) {
            $dirty2 |= $composer2.changed(user) ? 256 : 128;
        }
        if (($changed2 & 3072) == 0) {
            $dirty2 |= ($changed2 & 4096) == 0 ? $composer2.changed(billingViewModel) : $composer2.changedInstance(billingViewModel) ? 2048 : 1024;
        }
        if (($changed2 & 24576) == 0) {
            $dirty2 |= $composer2.changedInstance(context) ? 16384 : 8192;
        }
        if (!$composer2.shouldExecute((($dirty & 306783379) == 306783378 && ($dirty1 & 306783379) == 306783378 && ($dirty2 & 9363) == 9362) ? false : true, $dirty & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1501510425, $dirty, $dirty1, "com.example.sasloopmanager.PaymentDialog (BillingScreen.kt:2274)");
            }
            long CardDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface-0d7_KjU();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurfaceVariant-0d7_KjU();
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnBackground-0d7_KjU();
            MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            AndroidDialog_androidKt.Dialog(function0, (DialogProperties) null, ComposableLambdaKt.rememberComposableLambda(-407607760, true, (v29, v30) -> {
                return PaymentDialog$lambda$0(r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32, v29, v30);
            }, $composer2, 54), $composer2, 384 | (14 & $dirty), 2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v28, v29) -> {
                return PaymentDialog$lambda$1(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, v28, v29);
            });
        }
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit PaymentDialog$lambda$0(long $CardDark, long $CardBorderDark, Map $billingItems, String $discountInput, PosSettings $posSettings, String $orderType, String $serviceChargeInput, String $deliveryChargeInput, boolean $isComplimentaryOrder, String $advancePaidInput, String $paymentMethod, long $InputDark, Function1 $onPaymentMethodChange, Function0 $onDismissRequest, String $customerPhone, String $selectedDialCode, String $activeFlow, String $preOrderDate, String $preOrderTime, String $customerAddress, String $preOrderTypeInput, BillingViewModel $billingViewModel, String $customerName, String $preOrderIdInput, TableItem $selectedTable, String $selectedWaiter, UserProfile $user, Context $context, long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2284@116209L37,2287@116377L7810,2282@116122L8065:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-407607760, $changed, -1, "com.example.sasloopmanager.PaymentDialog.<anonymous> (BillingScreen.kt:2282)");
            }
            CardKt.Card(PaddingKt.padding-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(16)), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(16)), CardDefaults.INSTANCE.cardColors-ro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), (CardElevation) null, BorderStrokeKt.BorderStroke-cXLIe8U(Dp.constructor-impl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-838770178, true, (v28, v29, v30) -> {
                return PaymentDialog$lambda$0$0(r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32, r33, r34, v28, v29, v30);
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit PaymentDialog$lambda$0$0(Map $billingItems, String $discountInput, PosSettings $posSettings, String $orderType, String $serviceChargeInput, String $deliveryChargeInput, boolean $isComplimentaryOrder, String $advancePaidInput, String $paymentMethod, long $InputDark, long $CardBorderDark, Function1 $onPaymentMethodChange, Function0 $onDismissRequest, String $customerPhone, String $selectedDialCode, String $activeFlow, String $preOrderDate, String $preOrderTime, String $customerAddress, String $preOrderTypeInput, BillingViewModel $billingViewModel, String $customerName, String $preOrderIdInput, TableItem $selectedTable, String $selectedWaiter, UserProfile $user, Context $context, long $TextPrimary, ColumnScope $this$Card, Composer $composer, int $changed) {
        double d;
        Object obj;
        Object obj2;
        Object obj3;
        Intrinsics.checkNotNullParameter($this$Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C2288@116391L7786:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-838770178, $changed, -1, "com.example.sasloopmanager.PaymentDialog.<anonymous>.<anonymous> (BillingScreen.kt:2288)");
            }
            Modifier modifier = PaddingKt.padding-3ABfNKs(Modifier.Companion, Dp.constructor-impl(16));
            Alignment.Horizontal centerHorizontally = Alignment.Companion.getCenterHorizontally();
            Arrangement.Vertical vertical = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(vertical, centerHorizontally, $composer, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor);
            } else {
                $composer.useNode();
            }
            Composer composer = Updater.constructor-impl($composer);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            int i3 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer, -809136447, "C2293@116617L203,2336@118691L263,2343@118972L1071,2364@120061L1074,2385@121153L3010:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("Select Payment Method", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(16), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597830, 0, 262058);
            double d2 = 0.0d;
            Iterator it = $billingItems.entrySet().iterator();
            while (it.hasNext()) {
                d2 += ((MenuItem) ((Map.Entry) it.next()).getKey()).getPrice() * ((Number) r1.getValue()).intValue();
            }
            double d3 = d2;
            Double doubleOrNull = StringsKt.toDoubleOrNull($discountInput);
            double doubleValue = doubleOrNull != null ? doubleOrNull.doubleValue() : 0.0d;
            double coerceAtLeast = RangesKt.coerceAtLeast(d3 - doubleValue, 0.0d);
            double taxRate = $posSettings.getTaxRate();
            boolean isTaxInclusive = $posSettings.isTaxInclusive();
            double d4 = isTaxInclusive ? coerceAtLeast * (taxRate / (100.0d + taxRate)) : coerceAtLeast * (taxRate / 100.0d);
            double d5 = d4 / 2.0d;
            double d6 = d4 / 2.0d;
            double serviceChargeRate = ($posSettings.getEnableServiceCharge() && Intrinsics.areEqual($orderType, "DINE-IN")) ? coerceAtLeast * ($posSettings.getServiceChargeRate() / 100.0d) : 0.0d;
            Double doubleOrNull2 = StringsKt.toDoubleOrNull($serviceChargeInput);
            double doubleValue2 = doubleOrNull2 != null ? doubleOrNull2.doubleValue() : serviceChargeRate;
            if (Intrinsics.areEqual($orderType, "DELIVERY")) {
                Double doubleOrNull3 = StringsKt.toDoubleOrNull($deliveryChargeInput);
                d = doubleOrNull3 != null ? doubleOrNull3.doubleValue() : 0.0d;
            } else {
                d = 0.0d;
            }
            double d7 = d;
            double d8 = $isComplimentaryOrder ? 0.0d : isTaxInclusive ? coerceAtLeast + doubleValue2 + d7 : coerceAtLeast + d5 + d6 + doubleValue2 + d7;
            double rint = $posSettings.getAutoRoundOff() ? Math.rint(d8) : d8;
            Double doubleOrNull4 = StringsKt.toDoubleOrNull($advancePaidInput);
            double doubleValue3 = doubleOrNull4 != null ? doubleOrNull4.doubleValue() : 0.0d;
            double coerceAtLeast2 = RangesKt.coerceAtLeast(rint - doubleValue3, 0.0d);
            TextKt.Text-Nvy7gAk("Amount to Pay: " + $posSettings.getCurrency() + formatPrice(coerceAtLeast2, $posSettings), (Modifier) null, ColorKt.getSaSGreen(), (TextAutoSize) null, TextUnitKt.getSp(16), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597440, 0, 262058);
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal horizontal = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(horizontal, Alignment.Companion.getTop(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor2);
            } else {
                $composer.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer);
            Updater.set-impl(composer2, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i6 = 6 | (112 & (54 >> 6));
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, -1632477042, "C:BillingScreen.kt#7ez3px");
            $composer.startReplaceGroup(-1299585857);
            ComposerKt.sourceInformation($composer, "*2355@119682L33,2349@119275L728");
            for (String str : CollectionsKt.listOf(new String[]{"CASH", "UPI"})) {
                boolean areEqual = Intrinsics.areEqual($paymentMethod, str);
                Modifier modifier2 = BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU$default(ClipKt.clip(RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8))), areEqual ? ColorKt.getSaSGreen() : $InputDark, (Shape) null, 2, (Object) null), Dp.constructor-impl(1), areEqual ? ColorKt.getSaSGreen() : $CardBorderDark, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8)));
                boolean z = false;
                String str2 = null;
                Role role = null;
                MutableInteractionSource mutableInteractionSource = null;
                ComposerKt.sourceInformationMarkerStart($composer, 1945053493, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = $composer.changed($onPaymentMethodChange) | $composer.changed(str);
                Object rememberedValue = $composer.rememberedValue();
                if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                    Object obj4 = () -> {
                        return PaymentDialog$lambda$0$0$0$1$0$0$0(r0, r1);
                    };
                    modifier2 = modifier2;
                    z = false;
                    str2 = null;
                    role = null;
                    mutableInteractionSource = null;
                    $composer.updateRememberedValue(obj4);
                    obj3 = obj4;
                } else {
                    obj3 = rememberedValue;
                }
                ComposerKt.sourceInformationMarkerEnd($composer);
                Modifier modifier3 = PaddingKt.padding-VpY3zN4$default(ClickableKt.clickable-oSLSa3U$default(modifier2, z, str2, role, mutableInteractionSource, (Function0) obj3, 15, (Object) null), 0.0f, Dp.constructor-impl(12), 1, (Object) null);
                Alignment center = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier3);
                Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
                int i7 = 6 | (896 & ((112 & (48 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor3);
                } else {
                    $composer.useNode();
                }
                Composer composer3 = Updater.constructor-impl($composer);
                Updater.set-impl(composer3, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
                int i8 = 14 & (i7 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope = BoxScopeInstance.INSTANCE;
                int i9 = 6 | (112 & (48 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer, 428196408, "C2359@119896L81:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk(str, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
            }
            $composer.endReplaceGroup();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal horizontal2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(horizontal2, Alignment.Companion.getTop(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default2);
            Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
            int i10 = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor4);
            } else {
                $composer.useNode();
            }
            Composer composer4 = Updater.constructor-impl($composer);
            Updater.set-impl(composer4, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
            int i11 = 14 & (i10 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i12 = 6 | (112 & (54 >> 6));
            RowScope rowScope2 = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, 602080354, "C:BillingScreen.kt#7ez3px");
            $composer.startReplaceGroup(-1920239928);
            ComposerKt.sourceInformation($composer, "*2376@120774L33,2370@120367L728");
            for (String str3 : CollectionsKt.listOf(new String[]{"CARD", "CREDIT"})) {
                boolean areEqual2 = Intrinsics.areEqual($paymentMethod, str3);
                Modifier modifier4 = BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU$default(ClipKt.clip(RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8))), areEqual2 ? ColorKt.getSaSGreen() : $InputDark, (Shape) null, 2, (Object) null), Dp.constructor-impl(1), areEqual2 ? ColorKt.getSaSGreen() : $CardBorderDark, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8)));
                boolean z2 = false;
                String str4 = null;
                Role role2 = null;
                MutableInteractionSource mutableInteractionSource2 = null;
                ComposerKt.sourceInformationMarkerStart($composer, -1981542690, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed2 = $composer.changed($onPaymentMethodChange) | $composer.changed(str3);
                Object rememberedValue2 = $composer.rememberedValue();
                if (changed2 || rememberedValue2 == Composer.Companion.getEmpty()) {
                    Object obj5 = () -> {
                        return PaymentDialog$lambda$0$0$0$2$0$0$0(r0, r1);
                    };
                    modifier4 = modifier4;
                    z2 = false;
                    str4 = null;
                    role2 = null;
                    mutableInteractionSource2 = null;
                    $composer.updateRememberedValue(obj5);
                    obj2 = obj5;
                } else {
                    obj2 = rememberedValue2;
                }
                ComposerKt.sourceInformationMarkerEnd($composer);
                Modifier modifier5 = PaddingKt.padding-VpY3zN4$default(ClickableKt.clickable-oSLSa3U$default(modifier4, z2, str4, role2, mutableInteractionSource2, (Function0) obj2, 15, (Object) null), 0.0f, Dp.constructor-impl(12), 1, (Object) null);
                Alignment center2 = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy2 = BoxKt.maybeCachedBoxMeasurePolicy(center2, false);
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap5 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer, modifier5);
                Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                int i13 = 6 | (896 & ((112 & (48 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor5);
                } else {
                    $composer.useNode();
                }
                Composer composer5 = Updater.constructor-impl($composer);
                Updater.set-impl(composer5, maybeCachedBoxMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                int i14 = 14 & (i13 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope2 = BoxScopeInstance.INSTANCE;
                int i15 = 6 | (112 & (48 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer, 945531695, "C2380@120988L81:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk(str3, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 1597824, 0, 262058);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
            }
            $composer.endReplaceGroup();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            Modifier modifier6 = PaddingKt.padding-qDBjuR0$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(8), 0.0f, 0.0f, 13, (Object) null);
            Arrangement.Horizontal horizontal3 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy3 = RowKt.rowMeasurePolicy(horizontal3, Alignment.Companion.getTop(), $composer, (14 & (54 >> 3)) | (112 & (54 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap6 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier6 = ComposedModifierKt.materializeModifier($composer, modifier6);
            Function0 constructor6 = ComposeUiNode.Companion.getConstructor();
            int i16 = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                $composer.createNode(constructor6);
            } else {
                $composer.useNode();
            }
            Composer composer6 = Updater.constructor-impl($composer);
            Updater.set-impl(composer6, rowMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer6, currentCompositionLocalMap6, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer6, Integer.valueOf(hashCode6), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer6, materializeModifier6, ComposeUiNode.Companion.getSetModifier());
            int i17 = 14 & (i16 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i18 = 6 | (112 & (54 >> 6));
            RowScope rowScope3 = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, -172955801, "C2391@121453L40,2393@121572L83,2389@121345L310,2430@123944L39,2397@121718L2176,2396@121676L2469:BillingScreen.kt#7ez3px");
            ButtonKt.Button($onDismissRequest, RowScope.weight$default(rowScope3, Modifier.Companion, 1.0f, false, 2, (Object) null), false, (Shape) null, ButtonDefaults.INSTANCE.buttonColors-ro_MJ88($InputDark, 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14), (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableLambdaKt.rememberComposableLambda(1880259452, true, (v1, v2, v3) -> {
                return PaymentDialog$lambda$0$0$0$3$0(r11, v1, v2, v3);
            }, $composer, 54), $composer, 805306368, 492);
            ButtonColors buttonColors = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14);
            Modifier weight$default = RowScope.weight$default(rowScope3, Modifier.Companion, 1.0f, false, 2, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer, -559757236, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed3 = $composer.changed($onDismissRequest) | $composer.changed($customerPhone) | $composer.changed($selectedDialCode) | $composer.changed($activeFlow) | $composer.changed($preOrderDate) | $composer.changed($preOrderTime) | $composer.changed($customerAddress) | $composer.changed($preOrderTypeInput) | $composer.changedInstance($billingViewModel) | $composer.changed($customerName) | $composer.changed($paymentMethod) | $composer.changed($orderType) | $composer.changed(doubleValue) | $composer.changed(doubleValue2) | $composer.changed(d7) | $composer.changed(d5) | $composer.changed(d6) | $composer.changed($preOrderIdInput) | $composer.changed(doubleValue3) | $composer.changed(coerceAtLeast2) | $composer.changed($selectedTable) | $composer.changed($selectedWaiter) | $composer.changed($user) | $composer.changedInstance($context);
            Object rememberedValue3 = $composer.rememberedValue();
            if (changed3 || rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj6 = () -> {
                    return PaymentDialog$lambda$0$0$0$3$1$0(r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23);
                };
                $composer.updateRememberedValue(obj6);
                obj = obj6;
            } else {
                obj = rememberedValue3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.Button((Function0) obj, weight$default, false, (Shape) null, buttonColors, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$70721637$app(), $composer, 805306368, 492);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final Unit PaymentDialog$lambda$0$0$0$1$0$0$0(Function1 $onPaymentMethodChange, String $method) {
        $onPaymentMethodChange.invoke($method);
        return Unit.INSTANCE;
    }

    private static final Unit PaymentDialog$lambda$0$0$0$2$0$0$0(Function1 $onPaymentMethodChange, String $method) {
        $onPaymentMethodChange.invoke($method);
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit PaymentDialog$lambda$0$0$0$3$0(long $TextPrimary, RowScope $this$Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter($this$Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2394@121598L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1880259452, $changed, -1, "com.example.sasloopmanager.PaymentDialog.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2394)");
            }
            TextKt.Text-Nvy7gAk("Cancel", (Modifier) null, $TextPrimary, (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX WARN: Code restructure failed: missing block: B:25:0x00b5, code lost:
    
        if (r14 == null) goto L33;
     */
    /* JADX WARN: Code restructure failed: missing block: B:29:0x00cc, code lost:
    
        if (r18 == null) goto L39;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private static final kotlin.Unit PaymentDialog$lambda$0$0$0$3$1$0(kotlin.jvm.functions.Function0 r31, java.lang.String r32, java.lang.String r33, java.lang.String r34, java.lang.String r35, java.lang.String r36, java.lang.String r37, java.lang.String r38, com.example.sasloopmanager.BillingViewModel r39, java.lang.String r40, java.lang.String r41, java.lang.String r42, double r43, double r45, double r47, double r49, double r51, java.lang.String r53, double r54, double r56, com.example.sasloopmanager.data.TableItem r58, java.lang.String r59, com.example.sasloopmanager.data.UserProfile r60, android.content.Context r61) {
        /*
            Method dump skipped, instructions count: 252
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.PaymentDialog$lambda$0$0$0$3$1$0(kotlin.jvm.functions.Function0, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String, com.example.sasloopmanager.BillingViewModel, java.lang.String, java.lang.String, java.lang.String, double, double, double, double, double, java.lang.String, double, double, com.example.sasloopmanager.data.TableItem, java.lang.String, com.example.sasloopmanager.data.UserProfile, android.content.Context):kotlin.Unit");
    }

    private static final Unit PaymentDialog$lambda$0$0$0$3$1$0$0(Context $context, String $paymentMethod, boolean success) {
        if (success) {
            Toast.makeText($context, "Settle via " + $paymentMethod + " Successful", 0).show();
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void MenuSubTab(@NotNull String searchQuery, @NotNull String foodTypeFilter, @NotNull Function1<? super String, Unit> function1, @NotNull String selectedCategory, @NotNull List<CategoryItem> list, boolean isLoading, @Nullable String error, @NotNull List<MenuItem> list2, @NotNull Map<MenuItem, Integer> map, @NotNull Map<MenuItem, Integer> map2, int selectedPriceTier, @NotNull String currentOrderType, @NotNull List<OptionGroup> list3, @NotNull PosSettings posSettings, @NotNull BillingViewModel billingViewModel, @NotNull Function1<? super MenuItem, Unit> function12, @NotNull Function1<? super String, Unit> function13, @Nullable Composer $composer, int $changed, int $changed1) {
        Object obj;
        Object obj2;
        Object obj3;
        Object obj4;
        Intrinsics.checkNotNullParameter(searchQuery, "searchQuery");
        Intrinsics.checkNotNullParameter(foodTypeFilter, "foodTypeFilter");
        Intrinsics.checkNotNullParameter(function1, "onFoodTypeFilterChange");
        Intrinsics.checkNotNullParameter(selectedCategory, "selectedCategory");
        Intrinsics.checkNotNullParameter(list, "categories");
        Intrinsics.checkNotNullParameter(list2, "sortedItems");
        Intrinsics.checkNotNullParameter(map, "cart");
        Intrinsics.checkNotNullParameter(map2, "oldKotItems");
        Intrinsics.checkNotNullParameter(currentOrderType, "currentOrderType");
        Intrinsics.checkNotNullParameter(list3, "optionGroups");
        Intrinsics.checkNotNullParameter(posSettings, "posSettings");
        Intrinsics.checkNotNullParameter(billingViewModel, "billingViewModel");
        Intrinsics.checkNotNullParameter(function12, "onSelectItemForModifiers");
        Intrinsics.checkNotNullParameter(function13, "onActiveSubTabChange");
        Composer $composer2 = $composer.startRestartGroup(-1576532907);
        ComposerKt.sourceInformation($composer2, "C(MenuSubTab)N(searchQuery,foodTypeFilter,onFoodTypeFilterChange,selectedCategory,categories,isLoading,error,sortedItems,cart,oldKotItems,selectedPriceTier,currentOrderType,optionGroups,posSettings,billingViewModel,onSelectItemForModifiers,onActiveSubTabChange)2463@125055L11,2464@125114L11,2465@125168L11,2466@125231L11,2467@125294L11,2469@125328L5214:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int $dirty1 = $changed1;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changed(searchQuery) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(foodTypeFilter) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changedInstance(function1) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(selectedCategory) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changedInstance(list) ? 16384 : 8192;
        }
        if (($changed & 196608) == 0) {
            $dirty |= $composer2.changed(isLoading) ? 131072 : 65536;
        }
        if (($changed & 1572864) == 0) {
            $dirty |= $composer2.changed(error) ? 1048576 : 524288;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= $composer2.changedInstance(list2) ? 8388608 : 4194304;
        }
        if (($changed & 100663296) == 0) {
            $dirty |= $composer2.changedInstance(map) ? 67108864 : 33554432;
        }
        if (($changed & 805306368) == 0) {
            $dirty |= $composer2.changedInstance(map2) ? 536870912 : 268435456;
        }
        if (($changed1 & 3072) == 0) {
            $dirty1 |= ($changed1 & 4096) == 0 ? $composer2.changed(posSettings) : $composer2.changedInstance(posSettings) ? 2048 : 1024;
        }
        if (($changed1 & 24576) == 0) {
            $dirty1 |= ($changed1 & 32768) == 0 ? $composer2.changed(billingViewModel) : $composer2.changedInstance(billingViewModel) ? 16384 : 8192;
        }
        if ($composer2.shouldExecute((($dirty & 306783379) == 306783378 && ($dirty1 & 9217) == 9216) ? false : true, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1576532907, $dirty, $dirty1, "com.example.sasloopmanager.MenuSubTab (BillingScreen.kt:2462)");
            }
            long CardDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface-0d7_KjU();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurfaceVariant-0d7_KjU();
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnBackground-0d7_KjU();
            long TextSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer2, (14 & (6 >> 3)) | (112 & (6 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxSize$default);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (6 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor);
            } else {
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            int i3 = 6 | (112 & (6 >> 6));
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, -713136780, "C2470@125380L1989,2521@127626L1314,2515@127379L1561,2551@128950L41:BillingScreen.kt#7ez3px");
            Modifier modifier = PaddingKt.padding-VpY3zN4(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), CardDark, (Shape) null, 2, (Object) null), Dp.constructor-impl(16), Dp.constructor-impl(8));
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            Arrangement.Horizontal horizontal = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(horizontal, centerVertically, $composer2, (14 & (432 >> 3)) | (112 & (432 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer2, modifier);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (432 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor2);
            } else {
                $composer2.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer2, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i6 = 6 | (112 & (432 >> 6));
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, 1158552822, "C2485@126188L246,2480@125785L39,2478@125697L864:BillingScreen.kt#7ez3px");
            Modifier modifier2 = SizeKt.height-3ABfNKs(RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null), Dp.constructor-impl(48));
            Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
            TextFieldColors textFieldColors = OutlinedTextFieldDefaults.INSTANCE.colors-0hiis_0(0L, 0L, 0L, 0L, InputDark, InputDark, 0L, 0L, 0L, 0L, (TextSelectionColors) null, ColorKt.getSaSGreen(), CardBorderDark, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, $composer2, 0, 0, 0, 0, 3072, 2147477455, 4095);
            TextStyle textStyle = new TextStyle(TextPrimary, TextUnitKt.getSp(13), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777212, (DefaultConstructorMarker) null);
            String str = searchQuery;
            ComposerKt.sourceInformationMarkerStart($composer2, 1561394518, "CC(remember):BillingScreen.kt#9igjgp");
            boolean z = ($dirty1 & 57344) == 16384 || (($dirty1 & 32768) != 0 && $composer2.changedInstance(billingViewModel));
            Object rememberedValue = $composer2.rememberedValue();
            if (z || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj5 = (v1) -> {
                    return MenuSubTab$lambda$0$0$0$0(r0, v1);
                };
                str = str;
                $composer2.updateRememberedValue(obj5);
                obj = obj5;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            OutlinedTextFieldKt.OutlinedTextField(str, (Function1) obj, modifier2, false, false, textStyle, (Function2) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$1822856232$app(), ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-1739935609$app(), (Function2) null, (Function2) null, (Function2) null, (Function2) null, false, (VisualTransformation) null, (KeyboardOptions) null, (KeyboardActions) null, true, 0, 0, (MutableInteractionSource) null, shape, textFieldColors, $composer2, 113246208 | (14 & $dirty), 12582912, 0, 1965656);
            $composer2.startReplaceGroup(1561421907);
            ComposerKt.sourceInformation($composer2, "*2501@126922L32,2497@126709L636");
            for (String str2 : CollectionsKt.listOf(new String[]{"ALL", "VEG", "NON-VEG"})) {
                Modifier modifier3 = BackgroundKt.background-bw27NRU$default(ClipKt.clip(Modifier.Companion, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8))), Intrinsics.areEqual(foodTypeFilter, str2) ? ColorKt.getSaSGreen() : InputDark, (Shape) null, 2, (Object) null);
                boolean z2 = false;
                String str3 = null;
                Role role = null;
                MutableInteractionSource mutableInteractionSource = null;
                ComposerKt.sourceInformationMarkerStart($composer2, 799886783, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = (($dirty & 896) == 256) | $composer2.changed(str2);
                Object rememberedValue2 = $composer2.rememberedValue();
                if (changed || rememberedValue2 == Composer.Companion.getEmpty()) {
                    Object obj6 = () -> {
                        return MenuSubTab$lambda$0$0$1$0$0(r0, r1);
                    };
                    modifier3 = modifier3;
                    z2 = false;
                    str3 = null;
                    role = null;
                    mutableInteractionSource = null;
                    $composer2.updateRememberedValue(obj6);
                    obj4 = obj6;
                } else {
                    obj4 = rememberedValue2;
                }
                ComposerKt.sourceInformationMarkerEnd($composer2);
                Modifier modifier4 = PaddingKt.padding-VpY3zN4(ClickableKt.clickable-oSLSa3U$default(modifier3, z2, str3, role, mutableInteractionSource, (Function0) obj4, 15, (Object) null), Dp.constructor-impl(10), Dp.constructor-impl(10));
                Alignment center = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer2, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                CompositionLocalMap currentCompositionLocalMap3 = $composer2.getCurrentCompositionLocalMap();
                Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer2, modifier4);
                Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
                int i7 = 6 | (896 & ((112 & (48 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer2.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer2.startReusableNode();
                if ($composer2.getInserting()) {
                    $composer2.createNode(constructor3);
                } else {
                    $composer2.useNode();
                }
                Composer composer3 = Updater.constructor-impl($composer2);
                Updater.set-impl(composer3, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
                int i8 = 14 & (i7 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer2, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope = BoxScopeInstance.INSTANCE;
                int i9 = 6 | (112 & (48 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer2, -388487394, "C2505@127123L204:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk(str2, (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(10), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 1597824, 0, 262058);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
            }
            $composer2.endReplaceGroup();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Modifier modifier5 = PaddingKt.padding-VpY3zN4(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), CardDark, (Shape) null, 2, (Object) null), Dp.constructor-impl(16), Dp.constructor-impl(6));
            LazyListState lazyListState = null;
            PaddingValues paddingValues = null;
            boolean z3 = false;
            Arrangement.Horizontal horizontal2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
            Alignment.Vertical vertical = null;
            FlingBehavior flingBehavior = null;
            boolean z4 = false;
            OverscrollEffect overscrollEffect = null;
            ComposerKt.sourceInformationMarkerStart($composer2, -715673043, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed2 = (($dirty & 7168) == 2048) | (($dirty1 & 57344) == 16384 || (($dirty1 & 32768) != 0 && $composer2.changedInstance(billingViewModel))) | $composer2.changed(InputDark) | $composer2.changed(TextSecondary) | $composer2.changedInstance(list);
            Object rememberedValue3 = $composer2.rememberedValue();
            if (changed2 || rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj7 = (v5) -> {
                    return MenuSubTab$lambda$0$1$0(r0, r1, r2, r3, r4, v5);
                };
                modifier5 = modifier5;
                lazyListState = null;
                paddingValues = null;
                z3 = false;
                horizontal2 = horizontal2;
                vertical = null;
                flingBehavior = null;
                z4 = false;
                overscrollEffect = null;
                $composer2.updateRememberedValue(obj7);
                obj2 = obj7;
            } else {
                obj2 = rememberedValue3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            LazyDslKt.LazyRow(modifier5, lazyListState, paddingValues, z3, horizontal2, vertical, flingBehavior, z4, overscrollEffect, (Function1) obj2, $composer2, 24576, 494);
            DividerKt.HorizontalDivider-9IZ8Weo((Modifier) null, 0.0f, CardBorderDark, $composer2, 0, 3);
            if (isLoading) {
                $composer2.startReplaceGroup(-709684249);
                ComposerKt.sourceInformation($composer2, "2554@129030L152");
                Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(ColumnScope.weight$default(columnScope, Modifier.Companion, 1.0f, false, 2, (Object) null), 0.0f, 1, (Object) null);
                Alignment center2 = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer2, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy2 = BoxKt.maybeCachedBoxMeasurePolicy(center2, false);
                ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                CompositionLocalMap currentCompositionLocalMap4 = $composer2.getCurrentCompositionLocalMap();
                Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
                Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
                int i10 = 6 | (896 & ((112 & (48 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer2.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer2.startReusableNode();
                if ($composer2.getInserting()) {
                    $composer2.createNode(constructor4);
                } else {
                    $composer2.useNode();
                }
                Composer composer4 = Updater.constructor-impl($composer2);
                Updater.set-impl(composer4, maybeCachedBoxMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
                int i11 = 14 & (i10 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer2, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope2 = BoxScopeInstance.INSTANCE;
                int i12 = 6 | (112 & (48 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer2, 1588812236, "C2555@129125L43:BillingScreen.kt#7ez3px");
                ProgressIndicatorKt.CircularProgressIndicator-4lLiAd8((Modifier) null, ColorKt.getSaSGreen(), 0.0f, 0L, 0, 0.0f, $composer2, 0, 61);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endReplaceGroup();
            } else if (error != null) {
                $composer2.startReplaceGroup(-709485043);
                ComposerKt.sourceInformation($composer2, "2558@129231L146");
                Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(ColumnScope.weight$default(columnScope, Modifier.Companion, 1.0f, false, 2, (Object) null), 0.0f, 1, (Object) null);
                Alignment center3 = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer2, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy3 = BoxKt.maybeCachedBoxMeasurePolicy(center3, false);
                ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                CompositionLocalMap currentCompositionLocalMap5 = $composer2.getCurrentCompositionLocalMap();
                Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default2);
                Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                int i13 = 6 | (896 & ((112 & (48 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer2.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer2.startReusableNode();
                if ($composer2.getInserting()) {
                    $composer2.createNode(constructor5);
                } else {
                    $composer2.useNode();
                }
                Composer composer5 = Updater.constructor-impl($composer2);
                Updater.set-impl(composer5, maybeCachedBoxMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                int i14 = 14 & (i13 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer2, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope3 = BoxScopeInstance.INSTANCE;
                int i15 = 6 | (112 & (48 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer2, -301963831, "C2559@129326L37:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk(error, (Modifier) null, Color.Companion.getRed-0d7_KjU(), (TextAutoSize) null, 0L, (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 384 | (14 & ($dirty >> 18)), 0, 262138);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(-709267144);
                ComposerKt.sourceInformation($composer2, "2568@129736L790,2562@129407L1119");
                GridCells fixed = new GridCells.Fixed(3);
                Modifier fillMaxWidth$default3 = SizeKt.fillMaxWidth$default(ColumnScope.weight$default(columnScope, Modifier.Companion, 1.0f, false, 2, (Object) null), 0.0f, 1, (Object) null);
                PaddingValues paddingValues2 = PaddingKt.PaddingValues-0680j_4(Dp.constructor-impl(12));
                Arrangement.Horizontal horizontal3 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                GridCells gridCells = fixed;
                Modifier modifier6 = fillMaxWidth$default3;
                LazyGridState lazyGridState = null;
                PaddingValues paddingValues3 = paddingValues2;
                boolean z5 = false;
                Arrangement.Vertical vertical2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
                Arrangement.Horizontal horizontal4 = horizontal3;
                FlingBehavior flingBehavior2 = null;
                boolean z6 = false;
                OverscrollEffect overscrollEffect2 = null;
                ComposerKt.sourceInformationMarkerStart($composer2, -715606047, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance = $composer2.changedInstance(list2) | $composer2.changedInstance(map) | $composer2.changedInstance(map2) | (($dirty1 & 57344) == 16384 || (($dirty1 & 32768) != 0 && $composer2.changedInstance(billingViewModel))) | (($dirty1 & 7168) == 2048 || (($dirty1 & 4096) != 0 && $composer2.changedInstance(posSettings)));
                Object rememberedValue4 = $composer2.rememberedValue();
                if (changedInstance || rememberedValue4 == Composer.Companion.getEmpty()) {
                    Object obj8 = (v5) -> {
                        return MenuSubTab$lambda$0$4$0(r0, r1, r2, r3, r4, v5);
                    };
                    gridCells = gridCells;
                    modifier6 = modifier6;
                    lazyGridState = null;
                    paddingValues3 = paddingValues3;
                    z5 = false;
                    vertical2 = vertical2;
                    horizontal4 = horizontal4;
                    flingBehavior2 = null;
                    z6 = false;
                    overscrollEffect2 = null;
                    $composer2.updateRememberedValue(obj8);
                    obj3 = obj8;
                } else {
                    obj3 = rememberedValue4;
                }
                ComposerKt.sourceInformationMarkerEnd($composer2);
                LazyGridDslKt.LazyVerticalGrid(gridCells, modifier6, lazyGridState, paddingValues3, z5, vertical2, horizontal4, flingBehavior2, z6, overscrollEffect2, (Function1) obj3, $composer2, 1772544, 0, 916);
                $composer2.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer2.skipToGroupEnd();
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v19, v20) -> {
                return MenuSubTab$lambda$1(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, v19, v20);
            });
        }
    }

    private static final Unit MenuSubTab$lambda$0$0$0$0(BillingViewModel $billingViewModel, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $billingViewModel.setSearchQuery(it);
        return Unit.INSTANCE;
    }

    private static final Unit MenuSubTab$lambda$0$0$1$0$0(Function1 $onFoodTypeFilterChange, String $type) {
        $onFoodTypeFilterChange.invoke($type);
        return Unit.INSTANCE;
    }

    private static final Unit MenuSubTab$lambda$0$1$0(List $categories, String $selectedCategory, BillingViewModel $billingViewModel, long $InputDark, long $TextSecondary, LazyListScope $this$LazyRow) {
        Intrinsics.checkNotNullParameter($this$LazyRow, "$this$LazyRow");
        LazyListScope.item$default($this$LazyRow, (Object) null, (Object) null, ComposableLambdaKt.composableLambdaInstance(1163454792, true, (v4, v5, v6) -> {
            return MenuSubTab$lambda$0$1$0$0(r5, r6, r7, r8, v4, v5, v6);
        }), 3, (Object) null);
        $this$LazyRow.items($categories.size(), (Function1) null, new BillingScreenKt$MenuSubTab$lambda$0$1$0$.inlined.items.default.3(BillingScreenKt$MenuSubTab$lambda$0$1$0$.inlined.items.default.1.INSTANCE, $categories), ComposableLambdaKt.composableLambdaInstance(802480018, true, new BillingScreenKt$MenuSubTab$lambda$0$1$0$.inlined.items.default.4($categories, $selectedCategory, $billingViewModel, $InputDark, $TextSecondary)));
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    private static final Unit MenuSubTab$lambda$0$1$0$0(String $selectedCategory, BillingViewModel $billingViewModel, long $InputDark, long $TextSecondary, LazyItemScope $this$item, Composer $composer, int $changed) {
        Object obj;
        Intrinsics.checkNotNullParameter($this$item, "$this$item");
        ComposerKt.sourceInformation($composer, "C2525@127763L39,2527@127945L259,2523@127663L559:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1163454792, $changed, -1, "com.example.sasloopmanager.MenuSubTab.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2523)");
            }
            boolean areEqual = Intrinsics.areEqual($selectedCategory, "ALL");
            ComposerKt.sourceInformationMarkerStart($composer, 1388561967, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj2 = () -> {
                    return MenuSubTab$lambda$0$1$0$0$0$0(r0);
                };
                areEqual = areEqual;
                $composer.updateRememberedValue(obj2);
                obj = obj2;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ChipKt.FilterChip(areEqual, (Function0) obj, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-772659659$app(), (Modifier) null, false, (Function2) null, (Function2) null, (Shape) null, FilterChipDefaults.INSTANCE.filterChipColors-XqyqHi0($InputDark, $TextSecondary, 0L, 0L, 0L, 0L, 0L, ColorKt.getSaSGreen(), 0L, Color.Companion.getWhite-0d7_KjU(), 0L, 0L, $composer, 805306368, FilterChipDefaults.$stable << 6, 3452), (SelectableChipElevation) null, (BorderStroke) null, (MutableInteractionSource) null, $composer, 384, 0, 3832);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    private static final Unit MenuSubTab$lambda$0$1$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.setCategory("ALL");
        return Unit.INSTANCE;
    }

    private static final Object MenuSubTab$lambda$0$4$0$0(MenuItem it) {
        Intrinsics.checkNotNullParameter(it, "it");
        return Integer.valueOf(it.getId());
    }

    private static final Unit MenuSubTab$lambda$0$4$0(List $sortedItems, Map $cart, Map $oldKotItems, BillingViewModel $billingViewModel, PosSettings $posSettings, LazyGridScope $this$LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter($this$LazyVerticalGrid, "$this$LazyVerticalGrid");
        Function1 function1 = BillingScreenKt::MenuSubTab$lambda$0$4$0$0;
        $this$LazyVerticalGrid.items($sortedItems.size(), function1 != null ? (Function1) new BillingScreenKt$MenuSubTab$lambda$0$4$0$.inlined.items.default.2(function1, $sortedItems) : null, (Function2) null, new BillingScreenKt$MenuSubTab$lambda$0$4$0$.inlined.items.default.4(BillingScreenKt$MenuSubTab$lambda$0$4$0$.inlined.items.default.1.INSTANCE, $sortedItems), ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new BillingScreenKt$MenuSubTab$lambda$0$4$0$.inlined.items.default.5($sortedItems, $cart, $oldKotItems, $billingViewModel, $posSettings)));
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void KotSubTab(@Nullable Integer editingOrderId, @NotNull List<Order> list, @Nullable TableItem selectedTable, @NotNull Map<MenuItem, Integer> map, @NotNull Map<MenuItem, Integer> map2, @NotNull String activeFlow, @NotNull String preOrderDate, @NotNull Function1<? super String, Unit> function1, @NotNull String preOrderTime, @NotNull Function1<? super String, Unit> function12, @NotNull String preOrderTypeInput, @NotNull Function1<? super String, Unit> function13, @NotNull String customerName, @NotNull Function1<? super String, Unit> function14, @NotNull String customerPhone, @NotNull Function1<? super String, Unit> function15, @NotNull String selectedDialCode, @NotNull Function1<? super String, Unit> function16, @NotNull String customerAddress, @NotNull Function1<? super String, Unit> function17, @Nullable String selectedWaiter, @NotNull PosSettings posSettings, @NotNull BillingViewModel billingViewModel, @Nullable UserProfile user, @NotNull Context context, @NotNull Function1<? super String, Unit> function18, @Nullable Composer $composer, int $changed, int $changed1, int $changed2) {
        Object obj;
        Object obj2;
        Object obj3;
        Object obj4;
        Object obj5;
        Intrinsics.checkNotNullParameter(list, "activeOrders");
        Intrinsics.checkNotNullParameter(map, "cart");
        Intrinsics.checkNotNullParameter(map2, "oldKotItems");
        Intrinsics.checkNotNullParameter(activeFlow, "activeFlow");
        Intrinsics.checkNotNullParameter(preOrderDate, "preOrderDate");
        Intrinsics.checkNotNullParameter(function1, "onPreOrderDateChange");
        Intrinsics.checkNotNullParameter(preOrderTime, "preOrderTime");
        Intrinsics.checkNotNullParameter(function12, "onPreOrderTimeChange");
        Intrinsics.checkNotNullParameter(preOrderTypeInput, "preOrderTypeInput");
        Intrinsics.checkNotNullParameter(function13, "onPreOrderTypeInputChange");
        Intrinsics.checkNotNullParameter(customerName, "customerName");
        Intrinsics.checkNotNullParameter(function14, "onCustomerNameChange");
        Intrinsics.checkNotNullParameter(customerPhone, "customerPhone");
        Intrinsics.checkNotNullParameter(function15, "onCustomerPhoneChange");
        Intrinsics.checkNotNullParameter(selectedDialCode, "selectedDialCode");
        Intrinsics.checkNotNullParameter(function16, "onSelectedDialCodeChange");
        Intrinsics.checkNotNullParameter(customerAddress, "customerAddress");
        Intrinsics.checkNotNullParameter(function17, "onCustomerAddressChange");
        Intrinsics.checkNotNullParameter(posSettings, "posSettings");
        Intrinsics.checkNotNullParameter(billingViewModel, "billingViewModel");
        Intrinsics.checkNotNullParameter(context, "context");
        Intrinsics.checkNotNullParameter(function18, "onActiveSubTabChange");
        Composer $composer2 = $composer.startRestartGroup(-1108330265);
        ComposerKt.sourceInformation($composer2, "C(KotSubTab)N(editingOrderId,activeOrders,selectedTable,cart,oldKotItems,activeFlow,preOrderDate,onPreOrderDateChange,preOrderTime,onPreOrderTimeChange,preOrderTypeInput,onPreOrderTypeInputChange,customerName,onCustomerNameChange,customerPhone,onCustomerPhoneChange,selectedDialCode,onSelectedDialCodeChange,customerAddress,onCustomerAddressChange,selectedWaiter,posSettings,billingViewModel,user,context,onActiveSubTabChange)2618@131701L11,2619@131760L11,2620@131814L11,2621@131877L11,2622@131940L11,2624@131993L215,2632@132214L9702:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int $dirty1 = $changed1;
        int $dirty2 = $changed2;
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changedInstance(map) ? 2048 : 1024;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer2.changedInstance(map2) ? 16384 : 8192;
        }
        if (($changed & 196608) == 0) {
            $dirty |= $composer2.changed(activeFlow) ? 131072 : 65536;
        }
        if (($changed1 & 384) == 0) {
            $dirty1 |= $composer2.changed(customerName) ? 256 : 128;
        }
        if (($changed1 & 3072) == 0) {
            $dirty1 |= $composer2.changedInstance(function14) ? 2048 : 1024;
        }
        if (($changed1 & 24576) == 0) {
            $dirty1 |= $composer2.changed(customerPhone) ? 16384 : 8192;
        }
        if (($changed1 & 196608) == 0) {
            $dirty1 |= $composer2.changedInstance(function15) ? 131072 : 65536;
        }
        if (($changed1 & 100663296) == 0) {
            $dirty1 |= $composer2.changed(customerAddress) ? 67108864 : 33554432;
        }
        if (($changed1 & 805306368) == 0) {
            $dirty1 |= $composer2.changedInstance(function17) ? 536870912 : 268435456;
        }
        if (($changed2 & 6) == 0) {
            $dirty2 |= $composer2.changed(selectedWaiter) ? 4 : 2;
        }
        if (($changed2 & 48) == 0) {
            $dirty2 |= ($changed2 & 64) == 0 ? $composer2.changed(posSettings) : $composer2.changedInstance(posSettings) ? 32 : 16;
        }
        if (($changed2 & 384) == 0) {
            $dirty2 |= ($changed2 & 512) == 0 ? $composer2.changed(billingViewModel) : $composer2.changedInstance(billingViewModel) ? 256 : 128;
        }
        if (($changed2 & 24576) == 0) {
            $dirty2 |= $composer2.changedInstance(context) ? 16384 : 8192;
        }
        if (($changed2 & 196608) == 0) {
            $dirty2 |= $composer2.changedInstance(function18) ? 131072 : 65536;
        }
        if ($composer2.shouldExecute((($dirty & 74753) == 74752 && ($dirty1 & 302064769) == 302064768 && ($dirty2 & 73875) == 73874) ? false : true, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1108330265, $dirty, $dirty1, "com.example.sasloopmanager.KotSubTab (BillingScreen.kt:2617)");
            }
            long CardDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface-0d7_KjU();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurfaceVariant-0d7_KjU();
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnBackground-0d7_KjU();
            long TextSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            ComposerKt.sourceInformationMarkerStart($composer2, 46550878, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer2.changed(map2) | $composer2.changed(map);
            Object rememberedValue = $composer2.rememberedValue();
            if (changed || rememberedValue == Composer.Companion.getEmpty()) {
                Map mutableMap = MapsKt.toMutableMap(map2);
                for (Map.Entry entry : map.entrySet()) {
                    MenuItem key = entry.getKey();
                    int intValue = entry.getValue().intValue();
                    Integer num = (Integer) mutableMap.get(key);
                    mutableMap.put(key, Integer.valueOf((num != null ? num.intValue() : 0) + intValue));
                }
                Object map3 = MapsKt.toMap(mutableMap);
                $composer2.updateRememberedValue(map3);
                obj = map3;
            } else {
                obj = rememberedValue;
            }
            Map billingItems = (Map) obj;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Modifier modifier = PaddingKt.padding-3ABfNKs(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null), CardDark, (Shape) null, 2, (Object) null), Dp.constructor-impl(12));
            Arrangement.Vertical spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(spaceBetween, Alignment.Companion.getStart(), $composer2, (14 & (48 >> 3)) | (112 & (48 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor);
            } else {
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            int i3 = 6 | (112 & (48 >> 6));
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, 1455646519, "C2642@132511L21,2639@132411L6545,2789@139114L2796:BillingScreen.kt#7ez3px");
            Modifier verticalScroll$default = ScrollKt.verticalScroll$default(ColumnScope.weight$default(columnScope, Modifier.Companion, 1.0f, false, 2, (Object) null), ScrollKt.rememberScrollState(0, $composer2, 0, 1), false, (FlingBehavior) null, false, 14, (Object) null);
            Arrangement.Vertical vertical = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(12));
            ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(vertical, Alignment.Companion.getStart(), $composer2, (14 & (48 >> 3)) | (112 & (48 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer2, verticalScroll$default);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor2);
            } else {
                $composer2.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer2, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            int i6 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -2070626349, "C2645@132621L216,2743@137222L41,2745@137277L218,2753@137509L407,2763@137930L494:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("KOT CART ITEMS", (Modifier) null, TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, TextUnitKt.getSp(1), (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 102260742, 0, 261802);
            if (billingItems.isEmpty()) {
                $composer2.startReplaceGroup(-2070556135);
                ComposerKt.sourceInformation($composer2, "2654@132897L302");
                Modifier modifier2 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(100));
                Alignment center = Alignment.Companion.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer2, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                CompositionLocalMap currentCompositionLocalMap3 = $composer2.getCurrentCompositionLocalMap();
                Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer2, modifier2);
                Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
                int i7 = 6 | (896 & ((112 & (54 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer2.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer2.startReusableNode();
                if ($composer2.getInserting()) {
                    $composer2.createNode(constructor3);
                } else {
                    $composer2.useNode();
                }
                Composer composer3 = Updater.constructor-impl($composer2);
                Updater.set-impl(composer3, maybeCachedBoxMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
                int i8 = 14 & (i7 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer2, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScope boxScope = BoxScopeInstance.INSTANCE;
                int i9 = 6 | (112 & (54 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer2, 363503179, "C2660@133119L62:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk("Cart is empty", (Modifier) null, TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 24582, 0, 262122);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(-2070105550);
                ComposerKt.sourceInformation($composer2, "*2667@133427L3749");
                for (Map.Entry entry2 : billingItems.entrySet()) {
                    MenuItem menuItem = (MenuItem) entry2.getKey();
                    int intValue2 = ((Number) entry2.getValue()).intValue();
                    Integer num2 = map2.get(menuItem);
                    int intValue3 = num2 != null ? num2.intValue() : 0;
                    Integer num3 = map.get(menuItem);
                    int intValue4 = num3 != null ? num3.intValue() : 0;
                    Modifier modifier3 = PaddingKt.padding-3ABfNKs(BackgroundKt.background-bw27NRU(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), InputDark, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8))), Dp.constructor-impl(8));
                    Arrangement.Horizontal spaceBetween2 = Arrangement.INSTANCE.getSpaceBetween();
                    Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
                    ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                    MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween2, centerVertically, $composer2, (14 & (432 >> 3)) | (112 & (432 >> 3)));
                    ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                    CompositionLocalMap currentCompositionLocalMap4 = $composer2.getCurrentCompositionLocalMap();
                    Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer2, modifier3);
                    Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
                    int i10 = 6 | (896 & ((112 & (432 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer2.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer2.startReusableNode();
                    if ($composer2.getInserting()) {
                        $composer2.createNode(constructor4);
                    } else {
                        $composer2.useNode();
                    }
                    Composer composer4 = Updater.constructor-impl($composer2);
                    Updater.set-impl(composer4, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
                    int i11 = 14 & (i10 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                    int i12 = 6 | (112 & (432 >> 6));
                    RowScope rowScope = RowScopeInstance.INSTANCE;
                    ComposerKt.sourceInformationMarkerStart($composer2, 980526995, "C2675@133834L1836,2712@135720L1434:BillingScreen.kt#7ez3px");
                    Modifier weight$default = RowScope.weight$default(rowScope, Modifier.Companion, 1.0f, false, 2, (Object) null);
                    ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                    MeasurePolicy columnMeasurePolicy3 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer2, (14 & (0 >> 3)) | (112 & (0 >> 3)));
                    ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                    CompositionLocalMap currentCompositionLocalMap5 = $composer2.getCurrentCompositionLocalMap();
                    Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer2, weight$default);
                    Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
                    int i13 = 6 | (896 & ((112 & (0 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer2.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer2.startReusableNode();
                    if ($composer2.getInserting()) {
                        $composer2.createNode(constructor5);
                    } else {
                        $composer2.useNode();
                    }
                    Composer composer5 = Updater.constructor-impl($composer2);
                    Updater.set-impl(composer5, columnMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
                    int i14 = 14 & (i13 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                    ColumnScope columnScope3 = ColumnScopeInstance.INSTANCE;
                    int i15 = 6 | (112 & (0 >> 6));
                    ComposerKt.sourceInformationMarkerStart($composer2, -1416700076, "C2676@133903L256,2682@134188L40,2683@134257L249,2689@134564L1080:BillingScreen.kt#7ez3px");
                    TextKt.Text-Nvy7gAk(menuItem.getDisplayName(), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 1597824, 0, 262058);
                    SpacerKt.Spacer(SizeKt.height-3ABfNKs(Modifier.Companion, Dp.constructor-impl(2)), $composer2, 6);
                    String currency = posSettings.getCurrency();
                    StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                    Object[] objArr = {Double.valueOf(menuItem.getPrice())};
                    String format = String.format("%.2f", Arrays.copyOf(objArr, objArr.length));
                    Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                    TextKt.Text-Nvy7gAk(currency + " " + format + " x " + intValue2, (Modifier) null, TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 24576, 0, 262122);
                    Arrangement.Horizontal horizontal = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(6));
                    Modifier modifier4 = PaddingKt.padding-qDBjuR0$default(Modifier.Companion, 0.0f, Dp.constructor-impl(4), 0.0f, 0.0f, 13, (Object) null);
                    ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                    MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(horizontal, Alignment.Companion.getTop(), $composer2, (14 & (54 >> 3)) | (112 & (54 >> 3)));
                    ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                    CompositionLocalMap currentCompositionLocalMap6 = $composer2.getCurrentCompositionLocalMap();
                    Modifier materializeModifier6 = ComposedModifierKt.materializeModifier($composer2, modifier4);
                    Function0 constructor6 = ComposeUiNode.Companion.getConstructor();
                    int i16 = 6 | (896 & ((112 & (54 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer2.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer2.startReusableNode();
                    if ($composer2.getInserting()) {
                        $composer2.createNode(constructor6);
                    } else {
                        $composer2.useNode();
                    }
                    Composer composer6 = Updater.constructor-impl($composer2);
                    Updater.set-impl(composer6, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer6, currentCompositionLocalMap6, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer6, Integer.valueOf(hashCode6), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer6, materializeModifier6, ComposeUiNode.Companion.getSetModifier());
                    int i17 = 14 & (i16 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                    RowScope rowScope2 = RowScopeInstance.INSTANCE;
                    int i18 = 6 | (112 & (54 >> 6));
                    ComposerKt.sourceInformationMarkerStart($composer2, 1021784652, "C:BillingScreen.kt#7ez3px");
                    if (intValue3 > 0) {
                        $composer2.startReplaceGroup(1021790665);
                        ComposerKt.sourceInformation($composer2, "2694@134847L307");
                        TextKt.Text-Nvy7gAk("Punched: " + intValue3, (Modifier) null, androidx.compose.ui.graphics.ColorKt.Color(4283215696L), (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 1597824, 0, 262058);
                        $composer2.endReplaceGroup();
                    } else {
                        $composer2.startReplaceGroup(1022154884);
                        $composer2.endReplaceGroup();
                    }
                    if (intValue4 > 0) {
                        $composer2.startReplaceGroup(1022217101);
                        ComposerKt.sourceInformation($composer2, "2702@135277L303");
                        TextKt.Text-Nvy7gAk("Draft: " + intValue4, (Modifier) null, androidx.compose.ui.graphics.ColorKt.Color(4280391411L), (TextAutoSize) null, TextUnitKt.getSp(8), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 1597824, 0, 262058);
                        $composer2.endReplaceGroup();
                    } else {
                        $composer2.startReplaceGroup(1022577476);
                        $composer2.endReplaceGroup();
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    $composer2.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    $composer2.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    Arrangement.Horizontal horizontal2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(6));
                    Alignment.Vertical centerVertically2 = Alignment.Companion.getCenterVertically();
                    ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                    Modifier modifier5 = Modifier.Companion;
                    MeasurePolicy rowMeasurePolicy3 = RowKt.rowMeasurePolicy(horizontal2, centerVertically2, $composer2, (14 & (432 >> 3)) | (112 & (432 >> 3)));
                    ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode7 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                    CompositionLocalMap currentCompositionLocalMap7 = $composer2.getCurrentCompositionLocalMap();
                    Modifier materializeModifier7 = ComposedModifierKt.materializeModifier($composer2, modifier5);
                    Function0 constructor7 = ComposeUiNode.Companion.getConstructor();
                    int i19 = 6 | (896 & ((112 & (432 << 3)) << 6));
                    ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer2.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer2.startReusableNode();
                    if ($composer2.getInserting()) {
                        $composer2.createNode(constructor7);
                    } else {
                        $composer2.useNode();
                    }
                    Composer composer7 = Updater.constructor-impl($composer2);
                    Updater.set-impl(composer7, rowMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
                    Updater.set-impl(composer7, currentCompositionLocalMap7, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                    Updater.init-impl(composer7, Integer.valueOf(hashCode7), ComposeUiNode.Companion.getSetCompositeKeyHash());
                    Updater.reconcile-impl(composer7, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                    Updater.set-impl(composer7, materializeModifier7, ComposeUiNode.Companion.getSetModifier());
                    int i20 = 14 & (i19 >> 6);
                    ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                    RowScope rowScope3 = RowScopeInstance.INSTANCE;
                    int i21 = 6 | (112 & (432 >> 6));
                    ComposerKt.sourceInformationMarkerStart($composer2, 663884231, "C2717@135990L41,2716@135936L448,2724@136413L246,2731@136742L36,2730@136688L440:BillingScreen.kt#7ez3px");
                    ComposerKt.sourceInformationMarkerStart($composer2, -255678467, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changedInstance = (($dirty2 & 896) == 256 || (($dirty2 & 512) != 0 && $composer2.changedInstance(billingViewModel))) | $composer2.changedInstance(menuItem);
                    Object rememberedValue2 = $composer2.rememberedValue();
                    if (changedInstance || rememberedValue2 == Composer.Companion.getEmpty()) {
                        Object obj6 = () -> {
                            return KotSubTab$lambda$1$0$1$0$1$0$0(r0, r1);
                        };
                        $composer2.updateRememberedValue(obj6);
                        obj2 = obj6;
                    } else {
                        obj2 = rememberedValue2;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    IconButtonKt.IconButton((Function0) obj2, BackgroundKt.background-bw27NRU(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(24)), CardDark, RoundedCornerShapeKt.getCircleShape()), false, (IconButtonColors) null, (MutableInteractionSource) null, (Shape) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-1403361930$app(), $composer2, 1572864, 60);
                    TextKt.Text-Nvy7gAk(String.valueOf(intValue2), (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 1597824, 0, 262058);
                    ComposerKt.sourceInformationMarkerStart($composer2, -255654408, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changedInstance2 = (($dirty2 & 896) == 256 || (($dirty2 & 512) != 0 && $composer2.changedInstance(billingViewModel))) | $composer2.changedInstance(menuItem);
                    Object rememberedValue3 = $composer2.rememberedValue();
                    if (changedInstance2 || rememberedValue3 == Composer.Companion.getEmpty()) {
                        Object obj7 = () -> {
                            return KotSubTab$lambda$1$0$1$0$1$1$0(r0, r1);
                        };
                        $composer2.updateRememberedValue(obj7);
                        obj3 = obj7;
                    } else {
                        obj3 = rememberedValue3;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    IconButtonKt.IconButton((Function0) obj3, BackgroundKt.background-bw27NRU(SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(24)), ColorKt.getSaSGreen(), RoundedCornerShapeKt.getCircleShape()), false, (IconButtonColors) null, (MutableInteractionSource) null, (Shape) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-463450913$app(), $composer2, 1572864, 60);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    $composer2.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    $composer2.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                    ComposerKt.sourceInformationMarkerEnd($composer2);
                }
                $composer2.endReplaceGroup();
            }
            DividerKt.HorizontalDivider-9IZ8Weo((Modifier) null, 0.0f, CardBorderDark, $composer2, 0, 3);
            TextKt.Text-Nvy7gAk("CUSTOMER DETAILS", (Modifier) null, TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, TextUnitKt.getSp(1), (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 102260742, 0, 261802);
            OutlinedTextFieldKt.OutlinedTextField(customerName, function14, SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), false, false, new TextStyle(TextPrimary, TextUnitKt.getSp(13), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777212, (DefaultConstructorMarker) null), ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-272972895$app(), (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, false, (VisualTransformation) null, (KeyboardOptions) null, (KeyboardActions) null, true, 0, 0, (MutableInteractionSource) null, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8)), (TextFieldColors) null, $composer2, 1573248 | (14 & ($dirty1 >> 6)) | (112 & ($dirty1 >> 6)), 12582912, 0, 6160280);
            OutlinedTextFieldKt.OutlinedTextField(customerPhone, function15, SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), false, false, new TextStyle(TextPrimary, TextUnitKt.getSp(13), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777212, (DefaultConstructorMarker) null), ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$241312330$app(), (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, false, (VisualTransformation) null, new KeyboardOptions(0, (Boolean) null, KeyboardType.Companion.getPhone-PjHm6EE(), 0, (PlatformImeOptions) null, (Boolean) null, (LocaleList) null, 123, (DefaultConstructorMarker) null), (KeyboardActions) null, true, 0, 0, (MutableInteractionSource) null, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8)), (TextFieldColors) null, $composer2, 1573248 | (14 & ($dirty1 >> 12)) | (112 & ($dirty1 >> 12)), 12779520, 0, 6127512);
            if (Intrinsics.areEqual(activeFlow, "TAKEAWAY_DELIVERY") || Intrinsics.areEqual(activeFlow, "PREORDER")) {
                $composer2.startReplaceGroup(-2064954962);
                ComposerKt.sourceInformation($composer2, "2775@138523L409");
                OutlinedTextFieldKt.OutlinedTextField(customerAddress, function17, SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), false, false, new TextStyle(TextPrimary, TextUnitKt.getSp(13), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777212, (DefaultConstructorMarker) null), ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-635120625$app(), (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, (Function2) null, false, (VisualTransformation) null, (KeyboardOptions) null, (KeyboardActions) null, false, 0, 0, (MutableInteractionSource) null, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8)), (TextFieldColors) null, $composer2, 1573248 | (14 & ($dirty1 >> 24)) | (112 & ($dirty1 >> 24)), 0, 0, 6291352);
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(-2064548025);
                $composer2.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            double d = 0.0d;
            Iterator it = billingItems.entrySet().iterator();
            while (it.hasNext()) {
                d += ((MenuItem) ((Map.Entry) it.next()).getKey()).getPrice() * ((Number) r1.getValue()).intValue();
            }
            double d2 = d;
            int sumOfInt = CollectionsKt.sumOfInt(billingItems.values());
            Modifier modifier6 = PaddingKt.padding-qDBjuR0$default(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), 0.0f, Dp.constructor-impl(8), 0.0f, 0.0f, 13, (Object) null);
            Arrangement.Horizontal spaceBetween3 = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically3 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy4 = RowKt.rowMeasurePolicy(spaceBetween3, centerVertically3, $composer2, (14 & (438 >> 3)) | (112 & (438 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode8 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap8 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier8 = ComposedModifierKt.materializeModifier($composer2, modifier6);
            Function0 constructor8 = ComposeUiNode.Companion.getConstructor();
            int i22 = 6 | (896 & ((112 & (438 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor8);
            } else {
                $composer2.useNode();
            }
            Composer composer8 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer8, rowMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer8, currentCompositionLocalMap8, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer8, Integer.valueOf(hashCode8), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer8, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer8, materializeModifier8, ComposeUiNode.Companion.getSetModifier());
            int i23 = 14 & (i22 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope4 = RowScopeInstance.INSTANCE;
            int i24 = 6 | (112 & (438 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, 1447408560, "C2796@139366L456:BillingScreen.kt#7ez3px");
            ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier7 = Modifier.Companion;
            MeasurePolicy columnMeasurePolicy4 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.Companion.getStart(), $composer2, (14 & (0 >> 3)) | (112 & (0 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode9 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap9 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier9 = ComposedModifierKt.materializeModifier($composer2, modifier7);
            Function0 constructor9 = ComposeUiNode.Companion.getConstructor();
            int i25 = 6 | (896 & ((112 & (0 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor9);
            } else {
                $composer2.useNode();
            }
            Composer composer9 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer9, columnMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer9, currentCompositionLocalMap9, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer9, Integer.valueOf(hashCode9), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer9, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer9, materializeModifier9, ComposeUiNode.Companion.getSetModifier());
            int i26 = 14 & (i25 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope4 = ColumnScopeInstance.INSTANCE;
            int i27 = 6 | (112 & (0 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, 854420939, "C2797@139391L160,2802@139568L240:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk(sumOfInt + " items selected", (Modifier) null, TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 24576, 0, 262122);
            String currency2 = posSettings.getCurrency();
            StringCompanionObject stringCompanionObject2 = StringCompanionObject.INSTANCE;
            Object[] objArr2 = {Double.valueOf(d2)};
            String format2 = String.format("%.2f", Arrays.copyOf(objArr2, objArr2.length));
            Intrinsics.checkNotNullExpressionValue(format2, "format(...)");
            TextKt.Text-Nvy7gAk(currency2 + " " + format2, (Modifier) null, ColorKt.getSaSGreen(), (TextAutoSize) null, TextUnitKt.getSp(16), (FontStyle) null, FontWeight.Companion.getBlack(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 1597440, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (Intrinsics.areEqual(activeFlow, "DINEIN")) {
                $composer2.startReplaceGroup(1447895383);
                ComposerKt.sourceInformation($composer2, "2832@140999L39,2812@139932L1021,2811@139894L1342");
                ButtonColors buttonColors = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer2, ButtonDefaults.$stable << 12, 14);
                Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
                ComposerKt.sourceInformationMarkerStart($composer2, 462349194, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance3 = $composer2.changedInstance(map) | $composer2.changedInstance(context) | (($dirty2 & 896) == 256 || (($dirty2 & 512) != 0 && $composer2.changedInstance(billingViewModel))) | (($dirty1 & 896) == 256) | (($dirty1 & 57344) == 16384) | (($dirty1 & 234881024) == 67108864) | (($dirty2 & 14) == 4);
                Object rememberedValue4 = $composer2.rememberedValue();
                if (changedInstance3 || rememberedValue4 == Composer.Companion.getEmpty()) {
                    Object obj8 = () -> {
                        return KotSubTab$lambda$1$2$1$0(r0, r1, r2, r3, r4, r5, r6);
                    };
                    $composer2.updateRememberedValue(obj8);
                    obj5 = obj8;
                } else {
                    obj5 = rememberedValue4;
                }
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ButtonKt.Button((Function0) obj5, (Modifier) null, false, shape, buttonColors, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-746052958$app(), $composer2, 805306368, 486);
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(1449241713);
                ComposerKt.sourceInformation($composer2, "2846@141650L39,2839@141312L292,2838@141274L612");
                ButtonColors buttonColors2 = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer2, ButtonDefaults.$stable << 12, 14);
                Shape shape2 = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
                ComposerKt.sourceInformationMarkerStart($composer2, 462392625, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance4 = $composer2.changedInstance(billingItems) | $composer2.changedInstance(context) | (($dirty2 & 458752) == 131072);
                Object rememberedValue5 = $composer2.rememberedValue();
                if (changedInstance4 || rememberedValue5 == Composer.Companion.getEmpty()) {
                    Object obj9 = () -> {
                        return KotSubTab$lambda$1$2$2$0(r0, r1, r2);
                    };
                    $composer2.updateRememberedValue(obj9);
                    obj4 = obj9;
                } else {
                    obj4 = rememberedValue5;
                }
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ButtonKt.Button((Function0) obj4, (Modifier) null, false, shape2, buttonColors2, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$1180301113$app(), $composer2, 805306368, 486);
                $composer2.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer2.skipToGroupEnd();
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v29, v30) -> {
                return KotSubTab$lambda$2(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, v29, v30);
            });
        }
    }

    private static final Unit KotSubTab$lambda$1$0$1$0$1$0$0(BillingViewModel $billingViewModel, MenuItem $item) {
        $billingViewModel.removeFromCart($item);
        return Unit.INSTANCE;
    }

    private static final Unit KotSubTab$lambda$1$0$1$0$1$1$0(BillingViewModel $billingViewModel, MenuItem $item) {
        $billingViewModel.addToCart($item);
        return Unit.INSTANCE;
    }

    private static final Unit KotSubTab$lambda$1$2$1$0(Map $cart, Context $context, BillingViewModel $billingViewModel, String $customerName, String $customerPhone, String $customerAddress, String $selectedWaiter) {
        if ($cart.isEmpty()) {
            Toast.makeText($context, "No new items to save", 0).show();
        } else {
            $billingViewModel.saveKOT($customerName, $customerPhone, $customerAddress, "DINE-IN", "", $selectedWaiter, true, (v2) -> {
                return KotSubTab$lambda$1$2$1$0$0(r8, r9, v2);
            });
        }
        return Unit.INSTANCE;
    }

    private static final Unit KotSubTab$lambda$1$2$1$0$0(Context $context, BillingViewModel $billingViewModel, boolean success) {
        if (success) {
            Toast.makeText($context, "KOT Saved Successfully", 0).show();
            $billingViewModel.goBack();
        }
        return Unit.INSTANCE;
    }

    private static final Unit KotSubTab$lambda$1$2$2$0(Map $billingItems, Context $context, Function1 $onActiveSubTabChange) {
        if ($billingItems.isEmpty()) {
            Toast.makeText($context, "Cart is empty", 0).show();
        } else {
            $onActiveSubTabChange.invoke("BILLING");
        }
        return Unit.INSTANCE;
    }

    @ComposableTarget(applier = "androidx.compose.ui.UiComposable")
    @Composable
    public static final void BillingSubTab(@NotNull Map<MenuItem, Integer> map, @NotNull PosSettings posSettings, @NotNull String orderType, @NotNull String discountInput, @NotNull Function1<? super String, Unit> function1, @NotNull String serviceChargeInput, @NotNull Function1<? super String, Unit> function12, @NotNull String deliveryChargeInput, @NotNull Function1<? super String, Unit> function13, @NotNull String advancePaidInput, @NotNull Function1<? super String, Unit> function14, boolean isComplimentaryOrder, @NotNull Function1<? super Boolean, Unit> function15, @NotNull String customerName, @NotNull String customerPhone, @NotNull String customerAddress, @NotNull String preOrderDate, @NotNull String preOrderTime, @NotNull String preOrderTypeInput, @Nullable Integer editingOrderId, @NotNull String preOrderIdInput, @NotNull String activeFlow, @Nullable TableItem selectedTable, @Nullable String selectedWaiter, @Nullable UserProfile user, @NotNull BillingViewModel billingViewModel, @NotNull Context context, @NotNull Function1<? super Boolean, Unit> function16, @NotNull Function1<? super Boolean, Unit> function17, @NotNull Function1<? super Boolean, Unit> function18, @NotNull Function1<? super Boolean, Unit> function19, @NotNull Function1<? super Boolean, Unit> function110, @NotNull Function1<? super Boolean, Unit> function111, @NotNull Function1<? super Boolean, Unit> function112, @NotNull Function1<? super Boolean, Unit> function113, @Nullable Composer $composer, int $changed, int $changed1, int $changed2, int $changed3) {
        double d;
        Object obj;
        Object obj2;
        Object obj3;
        Object obj4;
        Object obj5;
        Intrinsics.checkNotNullParameter(map, "billingItems");
        Intrinsics.checkNotNullParameter(posSettings, "posSettings");
        Intrinsics.checkNotNullParameter(orderType, "orderType");
        Intrinsics.checkNotNullParameter(discountInput, "discountInput");
        Intrinsics.checkNotNullParameter(function1, "onDiscountInputChange");
        Intrinsics.checkNotNullParameter(serviceChargeInput, "serviceChargeInput");
        Intrinsics.checkNotNullParameter(function12, "onServiceChargeInputChange");
        Intrinsics.checkNotNullParameter(deliveryChargeInput, "deliveryChargeInput");
        Intrinsics.checkNotNullParameter(function13, "onDeliveryChargeInputChange");
        Intrinsics.checkNotNullParameter(advancePaidInput, "advancePaidInput");
        Intrinsics.checkNotNullParameter(function14, "onAdvancePaidInputChange");
        Intrinsics.checkNotNullParameter(function15, "onIsComplimentaryOrderChange");
        Intrinsics.checkNotNullParameter(customerName, "customerName");
        Intrinsics.checkNotNullParameter(customerPhone, "customerPhone");
        Intrinsics.checkNotNullParameter(customerAddress, "customerAddress");
        Intrinsics.checkNotNullParameter(preOrderDate, "preOrderDate");
        Intrinsics.checkNotNullParameter(preOrderTime, "preOrderTime");
        Intrinsics.checkNotNullParameter(preOrderTypeInput, "preOrderTypeInput");
        Intrinsics.checkNotNullParameter(preOrderIdInput, "preOrderIdInput");
        Intrinsics.checkNotNullParameter(activeFlow, "activeFlow");
        Intrinsics.checkNotNullParameter(billingViewModel, "billingViewModel");
        Intrinsics.checkNotNullParameter(context, "context");
        Intrinsics.checkNotNullParameter(function16, "onShowPaymentDialogChange");
        Intrinsics.checkNotNullParameter(function17, "onShowOldKotDialogChange");
        Intrinsics.checkNotNullParameter(function18, "onShowSplitBillDialogChange");
        Intrinsics.checkNotNullParameter(function19, "onShowPreviewDialogChange");
        Intrinsics.checkNotNullParameter(function110, "onShowDiscountDialogChange");
        Intrinsics.checkNotNullParameter(function111, "onShowChargesDialogChange");
        Intrinsics.checkNotNullParameter(function112, "onShowWaiterDialogChange");
        Intrinsics.checkNotNullParameter(function113, "onShowHistoryDialogChange");
        Composer $composer2 = $composer.startRestartGroup(-402920904);
        ComposerKt.sourceInformation($composer2, "C(BillingSubTab)N(billingItems,posSettings,orderType,discountInput,onDiscountInputChange,serviceChargeInput,onServiceChargeInputChange,deliveryChargeInput,onDeliveryChargeInputChange,advancePaidInput,onAdvancePaidInputChange,isComplimentaryOrder,onIsComplimentaryOrderChange,customerName,customerPhone,customerAddress,preOrderDate,preOrderTime,preOrderTypeInput,editingOrderId,preOrderIdInput,activeFlow,selectedTable,selectedWaiter,user,billingViewModel,context,onShowPaymentDialogChange,onShowOldKotDialogChange,onShowSplitBillDialogChange,onShowPreviewDialogChange,onShowDiscountDialogChange,onShowChargesDialogChange,onShowWaiterDialogChange,onShowHistoryDialogChange)2894@143417L11,2895@143476L11,2896@143530L11,2897@143593L11,2898@143656L11,2934@145011L7153:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int $dirty1 = $changed1;
        int $dirty2 = $changed2;
        int $dirty3 = $changed3;
        if (($changed & 6) == 0) {
            $dirty |= $composer2.changedInstance(map) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= ($changed & 64) == 0 ? $composer2.changed(posSettings) : $composer2.changedInstance(posSettings) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changed(orderType) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            $dirty |= $composer2.changed(discountInput) ? 2048 : 1024;
        }
        if (($changed & 196608) == 0) {
            $dirty |= $composer2.changed(serviceChargeInput) ? 131072 : 65536;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= $composer2.changed(deliveryChargeInput) ? 8388608 : 4194304;
        }
        if (($changed1 & 48) == 0) {
            $dirty1 |= $composer2.changed(isComplimentaryOrder) ? 32 : 16;
        }
        if (($changed1 & 384) == 0) {
            $dirty1 |= $composer2.changedInstance(function15) ? 256 : 128;
        }
        if (($changed2 & 1572864) == 0) {
            $dirty2 |= $composer2.changedInstance(context) ? 1048576 : 524288;
        }
        if (($changed2 & 12582912) == 0) {
            $dirty2 |= $composer2.changedInstance(function16) ? 8388608 : 4194304;
        }
        if (($changed2 & 805306368) == 0) {
            $dirty2 |= $composer2.changedInstance(function18) ? 536870912 : 268435456;
        }
        if (($changed3 & 48) == 0) {
            $dirty3 |= $composer2.changedInstance(function110) ? 32 : 16;
        }
        if (($changed3 & 384) == 0) {
            $dirty3 |= $composer2.changedInstance(function111) ? 256 : 128;
        }
        if ($composer2.shouldExecute((($dirty & 4261011) == 4261010 && ($dirty1 & 145) == 144 && ($dirty2 & 273154049) == 273154048 && ($dirty3 & 145) == 144) ? false : true, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-402920904, $dirty, $dirty1, "com.example.sasloopmanager.BillingSubTab (BillingScreen.kt:2893)");
            }
            long CardDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface-0d7_KjU();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline-0d7_KjU();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurfaceVariant-0d7_KjU();
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnBackground-0d7_KjU();
            long TextSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant-0d7_KjU();
            double d2 = 0.0d;
            Iterator<T> it = map.entrySet().iterator();
            while (it.hasNext()) {
                d2 += ((MenuItem) ((Map.Entry) it.next()).getKey()).getPrice() * ((Number) r1.getValue()).intValue();
            }
            double subtotal = d2;
            Double doubleOrNull = StringsKt.toDoubleOrNull(discountInput);
            double discount = doubleOrNull != null ? doubleOrNull.doubleValue() : 0.0d;
            double taxableAmount = RangesKt.coerceAtLeast(subtotal - discount, 0.0d);
            double taxRate = posSettings.getTaxRate();
            boolean isInclusive = posSettings.isTaxInclusive();
            double computedTax = isInclusive ? taxableAmount * (taxRate / (100.0d + taxRate)) : taxableAmount * (taxRate / 100.0d);
            double cgst = computedTax / 2.0d;
            double sgst = computedTax / 2.0d;
            double defaultServiceCharge = (posSettings.getEnableServiceCharge() && Intrinsics.areEqual(orderType, "DINE-IN")) ? taxableAmount * (posSettings.getServiceChargeRate() / 100.0d) : 0.0d;
            Double doubleOrNull2 = StringsKt.toDoubleOrNull(serviceChargeInput);
            double serviceCharge = doubleOrNull2 != null ? doubleOrNull2.doubleValue() : defaultServiceCharge;
            if (Intrinsics.areEqual(orderType, "DELIVERY")) {
                Double doubleOrNull3 = StringsKt.toDoubleOrNull(deliveryChargeInput);
                d = doubleOrNull3 != null ? doubleOrNull3.doubleValue() : 0.0d;
            } else {
                d = 0.0d;
            }
            double deliveryCharge = d;
            double calculatedTotal = isInclusive ? taxableAmount + serviceCharge + deliveryCharge : taxableAmount + cgst + sgst + serviceCharge + deliveryCharge;
            double totalBeforeRounding = isComplimentaryOrder ? 0.0d : calculatedTotal;
            double finalTotal = posSettings.getAutoRoundOff() ? Math.rint(totalBeforeRounding) : totalBeforeRounding;
            Modifier modifier = PaddingKt.padding-3ABfNKs(BackgroundKt.background-bw27NRU$default(SizeKt.fillMaxSize$default(Modifier.Companion, 0.0f, 1, (Object) null), CardDark, (Shape) null, 2, (Object) null), Dp.constructor-impl(16));
            Arrangement.Vertical spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(spaceBetween, Alignment.Companion.getStart(), $composer2, (14 & (48 >> 3)) | (112 & (48 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, modifier);
            Function0 constructor = ComposeUiNode.Companion.getConstructor();
            int i = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor);
            } else {
                $composer2.useNode();
            }
            Composer composer = Updater.constructor-impl($composer2);
            Updater.set-impl(composer, columnMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer, currentCompositionLocalMap, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer, Integer.valueOf(hashCode), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer, materializeModifier, ComposeUiNode.Companion.getSetModifier());
            int i2 = 14 & (i >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            int i3 = 6 | (112 & (48 >> 6));
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, 1037992347, "C2944@145308L21,2941@145208L6312,3080@151847L39,3073@151560L249,3072@151530L628:BillingScreen.kt#7ez3px");
            Modifier verticalScroll$default = ScrollKt.verticalScroll$default(ColumnScope.weight$default(columnScope, Modifier.Companion, 1.0f, false, 2, (Object) null), ScrollKt.rememberScrollState(0, $composer2, 0, 1), false, (FlingBehavior) null, false, 14, (Object) null);
            Arrangement.Vertical vertical = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(16));
            ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(vertical, Alignment.Companion.getStart(), $composer2, (14 & (48 >> 3)) | (112 & (48 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer2, verticalScroll$default);
            Function0 constructor2 = ComposeUiNode.Companion.getConstructor();
            int i4 = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor2);
            } else {
                $composer2.useNode();
            }
            Composer composer2 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer2, columnMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer2, currentCompositionLocalMap2, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer2, Integer.valueOf(hashCode2), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer2, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer2, materializeModifier2, ComposeUiNode.Companion.getSetModifier());
            int i5 = 14 & (i4 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            int i6 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -1997356885, "C2947@145418L217,2955@145649L2700,3008@148363L1918,3051@150498L55,3046@150295L1215:BillingScreen.kt#7ez3px");
            TextKt.Text-Nvy7gAk("RECEIPT SUMMARY", (Modifier) null, TextSecondary, (TextAutoSize) null, TextUnitKt.getSp(11), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, TextUnitKt.getSp(1), (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 102260742, 0, 261802);
            Modifier modifier2 = PaddingKt.padding-3ABfNKs(BorderKt.border-xT4_qwU(BackgroundKt.background-bw27NRU(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), InputDark, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12))), Dp.constructor-impl(1), CardBorderDark, RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12))), Dp.constructor-impl(16));
            Arrangement.Vertical vertical2 = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(10));
            ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy3 = ColumnKt.columnMeasurePolicy(vertical2, Alignment.Companion.getStart(), $composer2, (14 & (48 >> 3)) | (112 & (48 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer2, modifier2);
            Function0 constructor3 = ComposeUiNode.Companion.getConstructor();
            int i7 = 6 | (896 & ((112 & (48 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor3);
            } else {
                $composer2.useNode();
            }
            Composer composer3 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer3, columnMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer3, currentCompositionLocalMap3, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer3, Integer.valueOf(hashCode3), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer3, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer3, materializeModifier3, ComposeUiNode.Companion.getSetModifier());
            int i8 = 14 & (i7 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScope columnScope3 = ColumnScopeInstance.INSTANCE;
            int i9 = 6 | (112 & (48 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -372903847, "C2981@146758L87,2983@146863L100,2987@147186L111,2988@147314L99,2989@147430L99,2997@147956L87,2999@148061L274:BillingScreen.kt#7ez3px");
            $composer2.startReplaceGroup(-1674598334);
            ComposerKt.sourceInformation($composer2, "*2964@146069L653");
            for (Map.Entry entry : map.entrySet()) {
                MenuItem key = entry.getKey();
                int intValue = entry.getValue().intValue();
                Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
                Arrangement.Horizontal spaceBetween2 = Arrangement.INSTANCE.getSpaceBetween();
                ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween2, Alignment.Companion.getTop(), $composer2, (14 & (54 >> 3)) | (112 & (54 >> 3)));
                ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                CompositionLocalMap currentCompositionLocalMap4 = $composer2.getCurrentCompositionLocalMap();
                Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
                Function0 constructor4 = ComposeUiNode.Companion.getConstructor();
                int i10 = 6 | (896 & ((112 & (54 << 3)) << 6));
                ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer2.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer2.startReusableNode();
                if ($composer2.getInserting()) {
                    $composer2.createNode(constructor4);
                } else {
                    $composer2.useNode();
                }
                Composer composer4 = Updater.constructor-impl($composer2);
                Updater.set-impl(composer4, rowMeasurePolicy, ComposeUiNode.Companion.getSetMeasurePolicy());
                Updater.set-impl(composer4, currentCompositionLocalMap4, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
                Updater.init-impl(composer4, Integer.valueOf(hashCode4), ComposeUiNode.Companion.getSetCompositeKeyHash());
                Updater.reconcile-impl(composer4, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
                Updater.set-impl(composer4, materializeModifier4, ComposeUiNode.Companion.getSetModifier());
                int i11 = 14 & (i10 >> 6);
                ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                RowScope rowScope = RowScopeInstance.INSTANCE;
                int i12 = 6 | (112 & (54 >> 6));
                ComposerKt.sourceInformationMarkerStart($composer2, 959398095, "C2968@146255L190,2973@146470L230:BillingScreen.kt#7ez3px");
                TextKt.Text-Nvy7gAk(key.getDisplayName() + " x " + intValue, (Modifier) null, TextPrimary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 24576, 0, 262122);
                String currency = posSettings.getCurrency();
                StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                Object[] objArr = {Double.valueOf(key.getPrice() * intValue)};
                String format = String.format("%.2f", Arrays.copyOf(objArr, objArr.length));
                Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                TextKt.Text-Nvy7gAk(currency + " " + format, (Modifier) null, TextPrimary, (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, (FontWeight) null, (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 24576, 0, 262122);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                $composer2.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
                ComposerKt.sourceInformationMarkerEnd($composer2);
            }
            $composer2.endReplaceGroup();
            DividerKt.HorizontalDivider-9IZ8Weo(PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(4), 1, (Object) null), 0.0f, CardBorderDark, $composer2, 6, 2);
            String currency2 = posSettings.getCurrency();
            StringCompanionObject stringCompanionObject2 = StringCompanionObject.INSTANCE;
            Object[] objArr2 = {Double.valueOf(subtotal)};
            String format2 = String.format("%.2f", Arrays.copyOf(objArr2, objArr2.length));
            Intrinsics.checkNotNullExpressionValue(format2, "format(...)");
            m1ReceiptRow6jMSoI("Subtotal", currency2 + " " + format2, false, 0L, 0L, $composer2, 6, 28);
            if (discount > 0.0d) {
                $composer2.startReplaceGroup(-371991487);
                ComposerKt.sourceInformation($composer2, "2985@147020L131");
                String currency3 = posSettings.getCurrency();
                StringCompanionObject stringCompanionObject3 = StringCompanionObject.INSTANCE;
                Object[] objArr3 = {Double.valueOf(discount)};
                String format3 = String.format("%.2f", Arrays.copyOf(objArr3, objArr3.length));
                Intrinsics.checkNotNullExpressionValue(format3, "format(...)");
                m1ReceiptRow6jMSoI("Discount (-)", currency3 + " " + format3, false, androidx.compose.ui.graphics.ColorKt.Color(4294198070L), 0L, $composer2, 3078, 20);
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(-371827156);
                $composer2.endReplaceGroup();
            }
            String currency4 = posSettings.getCurrency();
            StringCompanionObject stringCompanionObject4 = StringCompanionObject.INSTANCE;
            Object[] objArr4 = {Double.valueOf(taxableAmount)};
            String format4 = String.format("%.2f", Arrays.copyOf(objArr4, objArr4.length));
            Intrinsics.checkNotNullExpressionValue(format4, "format(...)");
            m1ReceiptRow6jMSoI("Taxable Amount", currency4 + " " + format4, false, 0L, 0L, $composer2, 6, 28);
            String currency5 = posSettings.getCurrency();
            StringCompanionObject stringCompanionObject5 = StringCompanionObject.INSTANCE;
            Object[] objArr5 = {Double.valueOf(cgst)};
            String format5 = String.format("%.2f", Arrays.copyOf(objArr5, objArr5.length));
            Intrinsics.checkNotNullExpressionValue(format5, "format(...)");
            m1ReceiptRow6jMSoI("CGST (2.5%)", currency5 + " " + format5, false, 0L, 0L, $composer2, 6, 28);
            String currency6 = posSettings.getCurrency();
            StringCompanionObject stringCompanionObject6 = StringCompanionObject.INSTANCE;
            Object[] objArr6 = {Double.valueOf(sgst)};
            String format6 = String.format("%.2f", Arrays.copyOf(objArr6, objArr6.length));
            Intrinsics.checkNotNullExpressionValue(format6, "format(...)");
            m1ReceiptRow6jMSoI("SGST (2.5%)", currency6 + " " + format6, false, 0L, 0L, $composer2, 6, 28);
            if (serviceCharge > 0.0d) {
                $composer2.startReplaceGroup(-371425551);
                ComposerKt.sourceInformation($composer2, "2991@147591L115");
                String currency7 = posSettings.getCurrency();
                StringCompanionObject stringCompanionObject7 = StringCompanionObject.INSTANCE;
                Object[] objArr7 = {Double.valueOf(serviceCharge)};
                String format7 = String.format("%.2f", Arrays.copyOf(objArr7, objArr7.length));
                Intrinsics.checkNotNullExpressionValue(format7, "format(...)");
                m1ReceiptRow6jMSoI("Service Charge (+)", currency7 + " " + format7, false, 0L, 0L, $composer2, 6, 28);
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(-371276596);
                $composer2.endReplaceGroup();
            }
            if (deliveryCharge > 0.0d) {
                $composer2.startReplaceGroup(-371231057);
                ComposerKt.sourceInformation($composer2, "2994@147787L117");
                String currency8 = posSettings.getCurrency();
                StringCompanionObject stringCompanionObject8 = StringCompanionObject.INSTANCE;
                Object[] objArr8 = {Double.valueOf(deliveryCharge)};
                String format8 = String.format("%.2f", Arrays.copyOf(objArr8, objArr8.length));
                Intrinsics.checkNotNullExpressionValue(format8, "format(...)");
                m1ReceiptRow6jMSoI("Delivery Charge (+)", currency8 + " " + format8, false, 0L, 0L, $composer2, 6, 28);
                $composer2.endReplaceGroup();
            } else {
                $composer2.startReplaceGroup(-371080180);
                $composer2.endReplaceGroup();
            }
            DividerKt.HorizontalDivider-9IZ8Weo(PaddingKt.padding-VpY3zN4$default(Modifier.Companion, 0.0f, Dp.constructor-impl(4), 1, (Object) null), 0.0f, CardBorderDark, $composer2, 6, 2);
            String currency9 = posSettings.getCurrency();
            StringCompanionObject stringCompanionObject9 = StringCompanionObject.INSTANCE;
            Object[] objArr9 = {Double.valueOf(finalTotal)};
            String format9 = String.format("%.2f", Arrays.copyOf(objArr9, objArr9.length));
            Intrinsics.checkNotNullExpressionValue(format9, "format(...)");
            m1ReceiptRow6jMSoI("Grand Total", currency9 + " " + format9, true, ColorKt.getSaSGreen(), TextUnitKt.getSp(16), $composer2, 24966, 0);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null);
            Arrangement.Horizontal horizontal = Arrangement.INSTANCE.spacedBy-0680j_4(Dp.constructor-impl(8));
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(horizontal, Alignment.Companion.getTop(), $composer2, (14 & (54 >> 3)) | (112 & (54 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap5 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier5 = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default2);
            Function0 constructor5 = ComposeUiNode.Companion.getConstructor();
            int i13 = 6 | (896 & ((112 & (54 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor5);
            } else {
                $composer2.useNode();
            }
            Composer composer5 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer5, rowMeasurePolicy2, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer5, currentCompositionLocalMap5, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer5, Integer.valueOf(hashCode5), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer5, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer5, materializeModifier5, ComposeUiNode.Companion.getSetModifier());
            int i14 = 14 & (i13 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i15 = 6 | (112 & (54 >> 6));
            RowScope rowScope2 = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, 319722631, "C3014@148639L40,3013@148557L36,3012@148519L571,3025@149227L40,3024@149146L35,3023@149108L568,3036@149815L40,3035@149732L37,3034@149694L573:BillingScreen.kt#7ez3px");
            ButtonColors buttonColors = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(InputDark, 0L, 0L, 0L, $composer2, ButtonDefaults.$stable << 12, 14);
            Shape shape = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
            Modifier weight$default = RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer2, -1236612852, "CC(remember):BillingScreen.kt#9igjgp");
            boolean z = ($dirty3 & 112) == 32;
            Object rememberedValue = $composer2.rememberedValue();
            if (z || rememberedValue == Composer.Companion.getEmpty()) {
                Object obj6 = () -> {
                    return BillingSubTab$lambda$1$0$1$0$0(r0);
                };
                $composer2.updateRememberedValue(obj6);
                obj = obj6;
            } else {
                obj = rememberedValue;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ButtonKt.Button((Function0) obj, weight$default, false, shape, buttonColors, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-2145098248$app(), $composer2, 805306368, 484);
            ButtonColors buttonColors2 = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(InputDark, 0L, 0L, 0L, $composer2, ButtonDefaults.$stable << 12, 14);
            Shape shape2 = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
            Modifier weight$default2 = RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer2, -1236594005, "CC(remember):BillingScreen.kt#9igjgp");
            boolean z2 = ($dirty3 & 896) == 256;
            Object rememberedValue2 = $composer2.rememberedValue();
            if (z2 || rememberedValue2 == Composer.Companion.getEmpty()) {
                Object obj7 = () -> {
                    return BillingSubTab$lambda$1$0$1$1$0(r0);
                };
                $composer2.updateRememberedValue(obj7);
                obj2 = obj7;
            } else {
                obj2 = rememberedValue2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ButtonKt.Button((Function0) obj2, weight$default2, false, shape2, buttonColors2, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-1238753439$app(), $composer2, 805306368, 484);
            ButtonColors buttonColors3 = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(InputDark, 0L, 0L, 0L, $composer2, ButtonDefaults.$stable << 12, 14);
            Shape shape3 = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8));
            Modifier weight$default3 = RowScope.weight$default(rowScope2, Modifier.Companion, 1.0f, false, 2, (Object) null);
            ComposerKt.sourceInformationMarkerStart($composer2, -1236575251, "CC(remember):BillingScreen.kt#9igjgp");
            boolean z3 = ($dirty2 & 1879048192) == 536870912;
            Object rememberedValue3 = $composer2.rememberedValue();
            if (z3 || rememberedValue3 == Composer.Companion.getEmpty()) {
                Object obj8 = () -> {
                    return BillingSubTab$lambda$1$0$1$2$0(r0);
                };
                $composer2.updateRememberedValue(obj8);
                obj3 = obj8;
            } else {
                obj3 = rememberedValue3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ButtonKt.Button((Function0) obj3, weight$default3, false, shape3, buttonColors3, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$-994557568$app(), $composer2, 805306368, 484);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Modifier modifier3 = BackgroundKt.background-bw27NRU$default(ClipKt.clip(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(8))), InputDark, (Shape) null, 2, (Object) null);
            boolean z4 = false;
            String str = null;
            Role role = null;
            MutableInteractionSource mutableInteractionSource = null;
            ComposerKt.sourceInformationMarkerStart($composer2, -757011005, "CC(remember):BillingScreen.kt#9igjgp");
            boolean z5 = (($dirty1 & 896) == 256) | (($dirty1 & 112) == 32);
            Object rememberedValue4 = $composer2.rememberedValue();
            if (z5 || rememberedValue4 == Composer.Companion.getEmpty()) {
                Object obj9 = () -> {
                    return BillingSubTab$lambda$1$0$2$0(r0, r1);
                };
                modifier3 = modifier3;
                z4 = false;
                str = null;
                role = null;
                mutableInteractionSource = null;
                $composer2.updateRememberedValue(obj9);
                obj4 = obj9;
            } else {
                obj4 = rememberedValue4;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Modifier modifier4 = PaddingKt.padding-VpY3zN4(ClickableKt.clickable-oSLSa3U$default(modifier3, z4, str, role, mutableInteractionSource, (Function0) obj4, 15, (Object) null), Dp.constructor-impl(12), Dp.constructor-impl(10));
            Arrangement.Horizontal spaceBetween3 = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy3 = RowKt.rowMeasurePolicy(spaceBetween3, centerVertically, $composer2, (14 & (432 >> 3)) | (112 & (432 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap6 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier6 = ComposedModifierKt.materializeModifier($composer2, modifier4);
            Function0 constructor6 = ComposeUiNode.Companion.getConstructor();
            int i16 = 6 | (896 & ((112 & (432 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor6);
            } else {
                $composer2.useNode();
            }
            Composer composer6 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer6, rowMeasurePolicy3, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer6, currentCompositionLocalMap6, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer6, Integer.valueOf(hashCode6), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer6, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer6, materializeModifier6, ComposeUiNode.Companion.getSetModifier());
            int i17 = 14 & (i16 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope3 = RowScopeInstance.INSTANCE;
            int i18 = 6 | (112 & (432 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, 1026159721, "C3056@150783L351,3064@151323L155,3061@151151L345:BillingScreen.kt#7ez3px");
            Alignment.Vertical centerVertically2 = Alignment.Companion.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier5 = Modifier.Companion;
            MeasurePolicy rowMeasurePolicy4 = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically2, $composer2, (14 & (384 >> 3)) | (112 & (384 >> 3)));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode7 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap7 = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier7 = ComposedModifierKt.materializeModifier($composer2, modifier5);
            Function0 constructor7 = ComposeUiNode.Companion.getConstructor();
            int i19 = 6 | (896 & ((112 & (384 << 3)) << 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                $composer2.createNode(constructor7);
            } else {
                $composer2.useNode();
            }
            Composer composer7 = Updater.constructor-impl($composer2);
            Updater.set-impl(composer7, rowMeasurePolicy4, ComposeUiNode.Companion.getSetMeasurePolicy());
            Updater.set-impl(composer7, currentCompositionLocalMap7, ComposeUiNode.Companion.getSetResolvedCompositionLocals());
            Updater.init-impl(composer7, Integer.valueOf(hashCode7), ComposeUiNode.Companion.getSetCompositeKeyHash());
            Updater.reconcile-impl(composer7, ComposeUiNode.Companion.getApplyOnDeactivatedNodeAssertion());
            Updater.set-impl(composer7, materializeModifier7, ComposeUiNode.Companion.getSetModifier());
            int i20 = 14 & (i19 >> 6);
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScope rowScope4 = RowScopeInstance.INSTANCE;
            int i21 = 6 | (112 & (384 >> 6));
            ComposerKt.sourceInformationMarkerStart($composer2, -346306733, "C3057@150857L93,3058@150971L28,3059@151020L96:BillingScreen.kt#7ez3px");
            IconKt.Icon-ww6aTOc(CardGiftcardKt.getCardGiftcard(Icons.INSTANCE.getDefault()), (String) null, SizeKt.size-3ABfNKs(Modifier.Companion, Dp.constructor-impl(18)), ColorKt.getSaSGreenLight(), $composer2, 432, 0);
            SpacerKt.Spacer(SizeKt.width-3ABfNKs(Modifier.Companion, Dp.constructor-impl(8)), $composer2, 6);
            TextKt.Text-Nvy7gAk("Complimentary Order", (Modifier) null, Color.Companion.getWhite-0d7_KjU(), (TextAutoSize) null, TextUnitKt.getSp(13), (FontStyle) null, FontWeight.Companion.getBold(), (FontFamily) null, 0L, (TextDecoration) null, (TextAlign) null, 0L, 0, false, 0, 0, (Function1) null, (TextStyle) null, $composer2, 1597830, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            SwitchKt.Switch(isComplimentaryOrder, function15, (Modifier) null, (Function2) null, false, SwitchDefaults.INSTANCE.colors-V1nXRL4(ColorKt.getSaSGreen(), Color.copy-wmQWz5c$default(ColorKt.getSaSGreen(), 0.5f, 0.0f, 0.0f, 0.0f, 14, (Object) null), 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, $composer2, 0, SwitchDefaults.$stable << 18, 65532), (MutableInteractionSource) null, $composer2, (14 & ($dirty1 >> 3)) | (112 & ($dirty1 >> 3)), 92);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ButtonColors buttonColors4 = ButtonDefaults.INSTANCE.buttonColors-ro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer2, ButtonDefaults.$stable << 12, 14);
            Shape shape4 = RoundedCornerShapeKt.RoundedCornerShape-0680j_4(Dp.constructor-impl(12));
            Modifier modifier6 = SizeKt.height-3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.Companion, 0.0f, 1, (Object) null), Dp.constructor-impl(48));
            ComposerKt.sourceInformationMarkerStart($composer2, 33680187, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer2.changedInstance(map) | $composer2.changedInstance(context) | (($dirty2 & 29360128) == 8388608);
            Object rememberedValue5 = $composer2.rememberedValue();
            if (changedInstance || rememberedValue5 == Composer.Companion.getEmpty()) {
                Object obj10 = () -> {
                    return BillingSubTab$lambda$1$1$0(r0, r1, r2);
                };
                $composer2.updateRememberedValue(obj10);
                obj5 = obj10;
            } else {
                obj5 = rememberedValue5;
            }
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ButtonKt.Button((Function0) obj5, modifier6, false, shape4, buttonColors4, (ButtonElevation) null, (BorderStroke) null, (PaddingValues) null, (MutableInteractionSource) null, ComposableSingletons.BillingScreenKt.INSTANCE.getLambda$1672279442$app(), $composer2, 805306416, 484);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer2.skipToGroupEnd();
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope((v39, v40) -> {
                return BillingSubTab$lambda$2(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30, r31, r32, r33, r34, r35, r36, r37, r38, r39, v39, v40);
            });
        }
    }

    private static final Unit BillingSubTab$lambda$1$0$1$0$0(Function1 $onShowDiscountDialogChange) {
        $onShowDiscountDialogChange.invoke(true);
        return Unit.INSTANCE;
    }

    private static final Unit BillingSubTab$lambda$1$0$1$1$0(Function1 $onShowChargesDialogChange) {
        $onShowChargesDialogChange.invoke(true);
        return Unit.INSTANCE;
    }

    private static final Unit BillingSubTab$lambda$1$0$1$2$0(Function1 $onShowSplitBillDialogChange) {
        $onShowSplitBillDialogChange.invoke(true);
        return Unit.INSTANCE;
    }

    private static final Unit BillingSubTab$lambda$1$0$2$0(Function1 $onIsComplimentaryOrderChange, boolean $isComplimentaryOrder) {
        $onIsComplimentaryOrderChange.invoke(Boolean.valueOf(!$isComplimentaryOrder));
        return Unit.INSTANCE;
    }

    private static final Unit BillingSubTab$lambda$1$1$0(Map $billingItems, Context $context, Function1 $onShowPaymentDialogChange) {
        if ($billingItems.isEmpty()) {
            Toast.makeText($context, "No items to settle", 0).show();
        } else {
            $onShowPaymentDialogChange.invoke(true);
        }
        return Unit.INSTANCE;
    }
}
